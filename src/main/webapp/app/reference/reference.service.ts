import {Injectable} from '@angular/core';
import {LanguageService, NAMEDGRAPHS} from 'app/shared/base.imports';
import {FilterIdLabelI, MhdbdbIdLabelEntityService, OptionsI, QueryParameterI} from '../shared/mhdbdb-graph.service';
import {AnnotationClass} from './annotation.class';
import {Kwic, ElectronicText, Token} from './reference.class';
import {WorkFilterI, WorkOptionsI} from "app/work/work.service";
import {ContextRangeT, TokenFilterI} from "app/reference/referencePassage.service";

export interface TextQueryParameterI extends QueryParameterI<TextFilterI, TextOptionsI> {

}


export interface TextFilterI extends FilterIdLabelI {
  context: ContextRangeT,
  isWorkIdActive: boolean
  directlyFollowing: boolean,

  workId: string
  isElectronicIdActive: boolean
  electronicId: string
  tokenFilters?: TokenFilterI[],
}

export interface TextOptionI extends OptionsI {

}

export interface TextOptionsI extends OptionsI {
  useLucene: boolean
}

export const defaultTokenFilter: TokenFilterI = {
  searchLabelinLemma: false,
  label: '',
  pos: [],
  concepts: [],
  connectorAnd: true
}

export const defaultTextQP: TextQueryParameterI =
  {
    order: 'label',
    desc: false,
    limit: 10,
    offset: 0,
    lang: undefined,
    namedGraphs: NAMEDGRAPHS.get('text'),
    filter: {
      isIdActive: true,
      id: undefined,
      context: 1,
      directlyFollowing: true,
      isLabelActive: true,
      label: undefined,
      isWorkIdActive: true,
      workId: undefined,
      isElectronicIdActive: true,
      electronicId: undefined,
      tokenFilters: [defaultTokenFilter],
    },
    option: {
      useLucene: false
    }
  }

@Injectable({providedIn: 'root'})
export class TextService extends MhdbdbIdLabelEntityService<TextQueryParameterI, TextFilterI, TextOptionsI, ElectronicText> {
  protected _defaultQp: TextQueryParameterI = defaultTextQP

  constructor(
    protected _languageService: LanguageService,
  ) {
    super(_languageService)
    this._languageService.getCurrent().then(v => this._defaultQp.lang = v)
  }

  protected _sparqlQuery(qp: TextQueryParameterI, countResults: boolean): string {

    function posFilter(i: number, pos: string[]): string {
      let posUris = pos.map(p => `<${p}>`);
      let posFilter = ''
      if (pos.length > 0) {
        posFilter = `
                ?posAnnotation${i}
                    oa:hasBody ?pos${i} ;
                    oa:hasTarget ?token${i} ;
                .
                FILTER ( ?pos${i} IN (${posUris.join()}) )
                `
      }
      return posFilter
    }

    function conceptFilter(i: number, concepts: string[]): string {
      let conceptUris = concepts.map(c => `<${c}>`);
      let conceptFilter = ''
      if (concepts.length > 0) {
        conceptFilter = `
                ?conceptAnnotation${i}
                    oa:hasBody ?word${i} ;
                    oa:hasTarget ?token${i} ;
                .
                ?concept${i} skos:narrowerTransitive?/^dhpluso:isLexicalizedSenseOf/dhpluso:isSenseOf ?word${i}
                FILTER ( ?concept${i} IN (${conceptUris.join()}) )
                `
      }
      return conceptFilter
    }

    let token0 = ''
    if (qp.filter.tokenFilters[0].label != '') {
      if (qp.filter.tokenFilters[0].searchLabelinLemma) {
        token0 = `
                {
                    {
                        ?word a dhpluso:Word .
                        ?word dhpluso:canonicalForm/dhpluso:writtenRep ?label .
                        filter(regex(str(?label), "${this._labelFilterGenerator(qp.filter.tokenFilters[0].label, false)}", "i"))
                    }
                    [
                        oa:hasBody ?word ;
                        oa:hasTarget ?token0 ;
                    ]
                    ${posFilter(0, qp.filter.tokenFilters[0].pos)}
                    ${conceptFilter(0, qp.filter.tokenFilters[0].concepts)}
                }
                `
      } else {
        token0 = `
                    {
                        ?search a luc-index:token ;
                            luc:query "content:${this._labelFilterGenerator(qp.filter.tokenFilters[0].label, true)}" ;
                            luc:entities ?token0 .
                        ?token0 mhdbdbxml:partOf ?text ;
                            mhdbdbxml:n ?n0 .
                        ${posFilter(0, qp.filter.tokenFilters[0].pos)}
                        ${conceptFilter(0, qp.filter.tokenFilters[0].concepts)}
                    }
                `
      }
    } else {
      token0 = `
            {
                ?token0
                    a tei:seg ;
                    mhdbdbxml:n ?n0 ;
                .
                ${posFilter(0, qp.filter.tokenFilters[0].pos)}
                ${conceptFilter(0, qp.filter.tokenFilters[0].concepts)}
            }
            `
    }

    const lines = `
            {
                ?token0 mhdbdbxml:parent ?lines .
                ?lines a tei:l .
            }
            ${qp.filter.context > 1 ? `
                UNION
                {
                    select ?lines  {
                        ?token0 mhdbdbxml:parent ?lineX .
                        ?lineX a tei:l .
                        ?lineX mhdbdbxml:nextSibling+ ?lines .
                        ?lines a tei:l .
                    }
                    Limit ${qp.filter.context - 1}
                }
                UNION
                {
                    select ?lines  {
                        ?token0 mhdbdbxml:parent ?lineX .
                        ?lineX a tei:l .
                        ?lineX mhdbdbxml:prevSibling+ ?lines .
                        ?lines a tei:l .
                    }
                    Limit ${qp.filter.context - 1}
                }
            ` : ""}
        `

    let tokenSelects: string[] = []
    let tokens: string[] = []
    qp.filter.tokenFilters.forEach((tokenFilter, i) => {
      tokenSelects.push(`?token${i}`)
      if (i > 0) {
        if (tokenFilter.searchLabelinLemma) {
          tokens.push(
            `
                        {
                            ?lines mhdbdbxml:child ?token${i} .
                            [
                                oa:hasBody ?word ;
                                oa:hasTarget ?token${i} ;
                            ]
                            {
                                ?word${i} a dhpluso:Word .
                                ?word${i} dhpluso:canonicalForm/dhpluso:writtenRep ?label${i} .
                                filter(regex(str(?label${i}), "${this._labelFilterGenerator(tokenFilter.label, false)}", "i"))
                            }
                            ?token${i} mhdbdbxml:n ?n${i} .
                            ${posFilter(i, tokenFilter.pos)}
                            ${conceptFilter(i, tokenFilter.concepts)}
                            ${qp.filter.directlyFollowing === true ? `filter (?n${i} > ?n${i - 1})` : ''}
                        }
                        `
          )
        } else {
          tokens.push(
            `
                        {
                            ?lines mhdbdbxml:child ?token${i} .
                            ?token${i} mhdbdbxml:firstChild/mhdbdbxml:content ?content${i}
                            filter (regex(str(?content${i}),"${this._labelFilterGenerator(tokenFilter.label, false)}"))
                            ?token${i} mhdbdbxml:n ?n${i} .
                            ${posFilter(i, tokenFilter.pos)}
                            ${conceptFilter(i, tokenFilter.concepts)}
                            ${qp.filter.directlyFollowing === true ? `filter (?n${i} > ?n${i - 1})` : ''}
                        }
                        `
          )
        }

      }
    })

    let qt = ''
    if (countResults) {
      qt = `
                SELECT (count(*) as ?count) where {
                    ${token0}
                    ${lines}
                    ${tokens.join('\r\n')}
                }
            `
    } else {
      qt = `
            select distinct ${tokenSelects.join(' ')} ?id
            where {
                ${token0}
                ${lines}
                ${tokens.join('\r\n')}
                ?token0 mhdbdbxml:partOf ?id .

            }
            # order by ?text
            offset ${qp.offset}
            limit ${qp.limit}
            `
    }

    let bindings: string[] = []
    let filters: string[] = []

    let labelQuery = ''
    if (qp.filter.isLabelActive && qp.filter.label) {
      if (qp.option.useLucene) {
        // Todo: Add Lucene Index to graphdb
        labelQuery = `
                        ?search a luc-index:electronic ;
                        luc:query "title:${this._labelFilterGenerator(qp.filter.label, qp.option.useLucene)}" ;
                        luc:entities ?id .
                        `
      } else {
        filters.push(`filter(regex(str(?label), "${this._labelFilterGenerator(qp.filter.label, qp.option.useLucene)}", "i"))`)
      }
    }

    if (qp.filter.isIdActive && qp.filter.id) {
      bindings.push(`Bind (<${qp.filter.id}> as ?id)`)
    }
    if (qp.filter.isElectronicIdActive && qp.filter.electronicId) {
      bindings.push(`Bind (<${qp.filter.electronicId}> as ?electronicId)`)
    }
    if (qp.filter.isWorkIdActive && qp.filter.workId) {
      bindings.push(`Bind (<${qp.filter.workId}> as ?workId)`)
    }

    let instanceSelect = `
            ${bindings.join('\r\n')}
            ${labelQuery}
            ?id mhdbdbxml:root ?rootId .
            ?id dhpluso:hasElectronicInstance ?electronicId .
            ?electronicId dhpluso:instanceOf/dhpluso:expressionOf ?workId .

            ${filters.join('\r\n')}
        `

    let q: string = ''
    if (countResults) {
      q = `
                SELECT (count(*) as ?count)
                where {
                    {
                        ${instanceSelect}
                    }
                }

            `
    } else {
      q = `
                SELECT DISTINCT ?id ?label ?rootId ?electronicId ?workId
                WHERE {
                    {
                        SELECT DISTINCT ?id ?label ?rootId ?electronicId ?workId
                        WHERE {
                            ${instanceSelect}
                            ?electronicId rdfs:label ?label .
                            filter(langmatches(lang(?label),'${qp.lang}'))
                            {
                            SELECT DISTINCT ?token0 ?id
                            WHERE {
                                ${qt}
                            }
                            }
                        }
                        ${this._sparqlOrder(qp.order, qp.desc)}
                        ${this._sparqlLimitOffset(qp.limit, qp.offset)}
                    }
                }
                `
    }
    return q
  }

  protected _jsonToObject(bindings): ElectronicText[] {
    let instances: ElectronicText[] = []
    bindings.forEach(
      row => {
        instances.push(
          new ElectronicText(
            row.id.value,
            row.label.value,
            row.rootId.value,
            row.electronicId.value,
            row.workId.value,
          )
        )
      }
    )
    return instances
  }

  public getText(textId: string): Promise<ElectronicText> {
    let qp = this.defaultQp
    qp.filter.id = textId
    return this.getInstance(qp)
  }

  ////////
  //KWIC//
  ////////

  private sparqlKwic(centerUri: string, radius: number = 5): string {
    return `
            select distinct ?position ?seg ?n ?content
            where {
                { #self
                    Bind ('center' as ?position)
                    Bind (<${centerUri}> as ?seg)
                    ?seg mhdbdbxml:n ?n .
                    ?seg mhdbdbxml:firstChild/mhdbdbxml:content ?content .
                }
                UNION
                {	#left
                    select ?position ?seg ?n ?content where {
                        Bind ('left' as ?position)
                        Bind (<${centerUri}> as ?centerId)
                        { #Prose Text
                            ?centerId ^mhdbdbxml:nextSibling+/^mhdbdbxml:parent* ?seg .
                            ?seg a tei:seg ;
                                mhdbdbxml:n ?n .
                            ?seg mhdbdbxml:firstChild/mhdbdbxml:content ?content .
                        }
                        UNION
                        { #Verse Text
                            OPTIONAL {
                                ?centerId mhdbdbxml:parent+ ?centerL .
                                ?centerL a tei:l ;
                                    ^mhdbdbxml:nextSibling ?l .
                                ?l a tei:l ;
                                ^mhdbdbxml:parent* ?seg .
                                ?seg a tei:seg ;
                                    mhdbdbxml:n ?n .
                                ?seg mhdbdbxml:firstChild/mhdbdbxml:content ?content .
                            }
                        }
                    }
                    Order by desc(?n)
                    limit ${radius}
                }
                UNION
                {	#right
                    select ?position ?seg ?n ?content where {
                        Bind ('right' as ?position)
                        Bind (<${centerUri}> as ?centerId)
                        { #Prose Text
                            ?centerId mhdbdbxml:nextSibling+/^mhdbdbxml:parent* ?seg .
                            ?seg a tei:seg;
                                mhdbdbxml:n ?n .
                            ?seg mhdbdbxml:firstChild/mhdbdbxml:content ?content .
                        }
                        UNION
                        { #Verse Text
                            OPTIONAL {
                                ?centerId mhdbdbxml:parent+ ?centerL .
                                ?centerL a tei:l ;
                                    mhdbdbxml:nextSibling ?l .
                                ?l a tei:l ;
                                ^mhdbdbxml:parent* ?seg .
                                ?seg a tei:seg ;
                                    mhdbdbxml:n ?n .
                                ?seg mhdbdbxml:firstChild/mhdbdbxml:content ?content .
                            }
                        }
                    }
                    Order by ?n
                    limit ${radius}
                }
            }
            Order by ?n
            limit ${(radius * 2) + 1}
        `
  }

  private jsonToObjectKwic(bindings): Kwic {
    let left: Token[] = []
    let center: Token = undefined
    let right: Token[] = []
    bindings.forEach(
      row => {
        try {
          if (row.position.value == 'center' && 'seg' in row) {
            center = new Token(
              row.seg.value,
              row.n.value,
              row.content.value,
            )
          } else if (row.position.value == 'left' && 'seg' in row) {
            left.push(
              new Token(
                row.seg.value,
                row.n.value,
                row.content.value,
              )
            )
          } else if (row.position.value == 'right' && 'seg' in row) {
            right.push(
              new Token(
                row.seg.value,
                row.n.value,
                row.content.value,
              )
            )
          }
        } catch (error) {
          console.error('jsonToObjectKwic: Error ', error);
          console.error(row)
        }
      }
    )
    if (center) {
      return new Kwic(left, center, right)
    } else {
      return undefined
    }
  }

  public getKwic(centerUri: string, radius: number = 5): Promise<Kwic> {
    const query = this.sparqlKwic(centerUri, radius)
    return new Promise<Kwic>((resolve, reject) => {
      this._sq.query(query).then(
        data => {
          resolve(this.jsonToObjectKwic(data['results']['bindings']))
        },
        error => {
          reject(error)
        }
      )
    })
  }

  ///////////////
  //Annotations//
  ///////////////

  private annotationsSparqlQuery(limit: number, offset: number, bodyId?: string, targetId?: string, targetClass?: string): string {
    let body = (bodyId === undefined) ? "?body" : `<${bodyId}>`
    let target = (targetId === undefined) ? "?target" : `<${targetId}>`
    let bodyBind = (bodyId === undefined) ? "" : `BIND(<${bodyId}> AS ?body)`
    let targetBind = (targetId === undefined) ? "" : `BIND(<${targetId}> AS ?target)`
    const targetClassFilter = (targetClass === undefined) ? "" : `?target a ${targetClass} .`
    const query = `
            SELECT DISTINCT ?annotation ?body ?target ?count WHERE {
                {
                    SELECT DISTINCT (count(*) as ?count) WHERE {
                        ${bodyBind}
                        ${targetBind}
                        ?annotation oa:hasBody ${body} . # i.E.: mhdbdbi:VEX
                        ?annotation oa:hasTarget ${target} . # i.E.: mhdbdbtext:KU#KU_11132_7
                        ${targetClassFilter}
                    }
                }
                ${bodyBind}
                ${targetBind}
                ?annotation oa:hasBody ${body} . # i.E.: mhdbdbi:VEX
                ?annotation oa:hasTarget ${target} . # i.E.: mhdbdbtext:KU#KU_11132_7
                ${targetClassFilter}
            }
            OFFSET ${offset}
            LIMIT ${limit}
        `
    return query
  }

  private jsonToObjectAnnotation(bindings): AnnotationClass[] {
    let annotations: AnnotationClass[] = []
    bindings.forEach(
      row => {
        try {
          annotations.push(
            new AnnotationClass(
              row.annotation.value,
              row.body.value,
              row.target.value
            )
          )
        } catch (error) {
          console.error('jsonToObjectAnnotation: Error ', error);
          console.error(row)
        }
      }
    )
    return annotations

  }

  getAnnotations(limit: number, offset: number, bodyId?: string, targetId?: string, targetClass?: string): Promise<[AnnotationClass[], number]> {
    const query = this.annotationsSparqlQuery(limit, offset, bodyId, targetId, targetClass)
    return new Promise<[AnnotationClass[], number]>((resolve, reject) => {
      this._sq.query(query).then(
        data => {
          let total: number = 0
          if (
            data.results.bindings &&
            data.results.bindings.length >= 1
          ) {
            total = data.results.bindings[0].count.value
            if (total && total <= 0) {
              resolve([[], 0])
            } else {
              resolve([this.jsonToObjectAnnotation(data.results.bindings), total])
            }
          } else {
            resolve([[], 0])
          }


        },
        error => {
          reject(error)
        }
      )
    })
  }


}
