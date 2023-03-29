/* eslint-disable object-shorthand */
import {HttpClient} from '@angular/common/http';
import {Injectable, OnInit} from '@angular/core';
import {LanguageService, NAMEDGRAPHS} from 'app/shared/base.imports';
import {Person} from '../indices/person/person.class';
import {
  MhdbdbIdLabelEntityService,
  FilterIdI,
  FilterLabelI,
  OptionsI,
  QueryParameterI
} from "../shared/mhdbdb-graph.service";
import {WorkClass} from "./work.class";

export interface WorkQueryParameterI extends QueryParameterI<WorkFilterI, WorkOptionsI> {
  filter: WorkFilterI,
  option: WorkOptionsI
}

export interface WorkFilterI extends FilterIdI, FilterLabelI {
  authorIds?: string[],
  isAuthorIdsActive: boolean
}

export interface WorkOptionsI extends OptionsI {
  useLucene: boolean
}

export const defaultWorkQP: WorkQueryParameterI =
  {
    order: 'label',
    desc: false,
    limit: 10,
    offset: 0,
    lang: undefined,
    namedGraphs: NAMEDGRAPHS.get('default'),
    filter: {
      label: '',
      isLabelActive: true,
      authorIds: [],
      isAuthorIdsActive: true
    },
    option: {
      useLucene: false
    }
  }

@Injectable({providedIn: 'root'})
export class WorkService extends MhdbdbIdLabelEntityService<WorkQueryParameterI, WorkFilterI, WorkOptionsI, WorkClass> {
  protected _defaultQp: WorkQueryParameterI = defaultWorkQP;

  constructor(
    protected _languageService: LanguageService
  ) {
    super(_languageService)
    this._languageService.getCurrent().then(v => this._defaultQp.lang = v)
  }

  /*
      _sparqlQuery(
          qp: WorkQueryParameterI,
          countResults: boolean = false
      ): string {


          let instanceSelector = `?id a dhpluso:Text ;
                                      dhpluso:hasExpression ?text .
                                  ?text a dhpluso:Text .
                                  ?electronic dhpluso:instanceOf ?text ;
                                      a dhpluso:Electronic .
                                  ?id rdfs:label ?label .
                                  filter(langMatches( lang(?label), "${qp.lang}" ))`
          let filters = []

          // label query
          let labelQuery = ''
          if (qp.filter.isLabelActive) {
              if (qp.filter.id || qp.option.useLucene === false || !('label' in qp.filter && qp.filter.label != '')) {
                  labelQuery = instanceSelector
              } else { // Lucene query

                  labelQuery = `
                          ?search a luc-index:work ;
                          luc:query "title:${this._labelFilterGenerator(qp.filter.label, qp.option.useLucene)}" ;
                          luc:entities ?id .
                          `
              }
              // Title Filter (regexp mode)
              if (!qp.filter.id && qp.option.useLucene === false && 'label' in qp.filter && qp.filter.label != '') {
                  filters.push(`filter(regex(str(?label), "${this._labelFilterGenerator(qp.filter.label)}", "i"))`)
              }
          }


          let authorFilter = []
          // for (let i in qp.filter.authorIds) {
          //     authorFilter.push(`{ ?id dhpluso:contribution/dhpluso:agent <${qp.filter.authorIds[i]}>. }`)
          // }
          // if (authorFilter.length >= 1) {
          //     filters.push(authorFilter.join(" UNION "))
          // }


          let instanceSelect = ''
          if (qp.filter.id) {
              instanceSelect = `
                  SELECT DISTINCT ?id ?label
                  WHERE {
                      ${this._sparqlGenerateBinding(qp.filter.id)}
                      ${labelQuery}
                  }
              `
          } else {
              instanceSelect = `
                  SELECT DISTINCT ?id ?label
                  WHERE {
                      ${labelQuery}
                      ${filters.join("\n")}
                  }
              `
          }


          let q = ''
          if (countResults) {
              q = `
                  SELECT (count(*) as ?count)
                  ${this._sparqlNamedGraph(qp.namedGraphs)}
                  where {
                      {
                          ${instanceSelect}
                      }
                  }

              `
          } else {
              q = `
                  SELECT DISTINCT
                      ?id
                      ?label
                      ?authorId
                      ?authorLabel
                      ?dateOfCreation
                      ?precision
                  ${this._sparqlNamedGraph(qp.namedGraphs)}
                  WHERE {
                      # Bindings
                      ${this._sparqlGenerateBinding(qp.filter.id)}
                      {
                          ${instanceSelect}
                          ${this._sparqlOrder(qp.order, qp.desc)}
                          ${this._sparqlLimitOffset(qp.limit, qp.offset)}
                      }

                      # author
                      ?id dhpluso:contribution ?contribution .
                      ?contribution
                          dhpluso:role <http://id.loc.gov/vocabulary/relators/aut> ;
                          dhpluso:agent ?authorId.
                      # label
                      ?authorId rdfs:label ?authorLabel.
                      filter(langMatches( lang(?authorLabel), "${qp.lang}" ))

                      # dateOfCreation
                      OPTIONAL{
                          {
                              ?id dhpluso:wasCreatedBy/dhpluso:hasTimeSpan ?timespan .
                          }
                          OPTIONAL {
                              ?timespan dhpluso:inXSDDate ?pointDate .
                          }
                          OPTIONAL {
                              ?timespan dhpluso:inXSDgYear ?pointYear .
                          }
                          OPTIONAL {
                              ?timespan dhpluso:timePrecision ?pointPrecision .
                          }
                          OPTIONAL {
                              ?timespan dhpluso:hasBeginning/dhpluso:inXSDDate ?fromDate .
                          }
                          OPTIONAL {
                              ?timespan dhpluso:hasBeginning/dhpluso:inXSDgYear ?fromYear .
                          }
                          OPTIONAL {
                              ?timespan dhpluso:hasBeginning/dhpluso:timePrecision ?fromPrecision .
                          }
                          OPTIONAL {
                              ?timespan dhpluso:hasEnd/dhpluso:inXSDDate ?toDate .
                          }
                          OPTIONAL {
                              ?timespan dhpluso:hasEnd/dhpluso:inXSDgYear ?toYear .
                          }
                          OPTIONAL {
                              ?timespan dhpluso:hasEnd/dhpluso:timePrecision ?toPrecision .
                          }
                          BIND(
                              IF(
                                  BOUND(?pointDate),
                                  CONCAT(
                                      STR(DAY(?pointDate)), ".",
                                      STR(MONTH(?pointDate)), ".",
                                      STR(YEAR(?pointDate))
                                  ),
                                  IF(
                                      BOUND(?pointYear),
                                      STR(?pointYear),
                                      IF(
                                          BOUND(?fromDate) && BOUND(?toDate),
                                          CONCAT(
                                              STR(DAY(?fromDate)), ".",
                                              STR(MONTH(?fromDate)), ".",
                                              STR(YEAR(?fromDate)), "–",
                                              STR(DAY(?toDate)), ".",
                                              STR(MONTH(?toDate)), ".",
                                              STR(YEAR(?toDate))
                                          ),
                                          IF(
                                              BOUND(?fromYear) && BOUND(?toYear),
                                              CONCAT(
                                                  STR(?fromYear), "–",
                                                  STR(?toYear)
                                              ),
                                              ?nothing
                                          )
                                      )
                                  )
                              )
                              AS ?dateOfCreation
                          )
                          BIND(
                              IF(
                                  BOUND(?pointPrecision),
                                  ?pointPrecision,
                                  IF(
                                      BOUND(?fromPrecision),
                                      ?fromPrecision,
                                      ?nothing
                                  )
                              )
                              AS ?precision
                          )
                      }
                  }
          `
          }
          console.warn(q)
          return q

      }*/


  _jsonToObject(bindings: any): WorkClass[] {
    let results: WorkClass[] = super._jsonToObject(bindings) as WorkClass[]

    /* bindings.forEach(
      item => {
        let element = results.find(element => element.id === item.id.value)
        if (element && !element.authors) {
          const authorElem = new Person(
            item.authorId.value,
            item.authorLabel.value,
          )
          let authorList: Person[] = []
          authorList.push(authorElem)
          element.authors = authorList
        } else if (element && element.authors.find(authorElem => authorElem.id === item.authorId.value)) {
          const authorElem = new Person(
            item.authorId.value,
            item.authorLabel.value,
          )
          element.authors.push(authorElem)
        }
      }
    ); */
    return results
  }

  protected _sparqlQuery(qp: WorkQueryParameterI, countResults: boolean): string {

    let instanceSelector = `?id a dhpluso:Text ;
                                    dhpluso:hasExpression ?text .
                                ?text a dhpluso:Text .
                                ?electronic dhpluso:instanceOf ?text ;
                                    a dhpluso:Electronic .
                                ?id rdfs:label ?label .
                                filter(langMatches( lang(?label), "${qp.lang}" ))
                                FILTER regex(?label, "${qp.filter.label}", "i")
                                `

    let labelQuery = ''
    labelQuery = instanceSelector;

    let instanceSelect = '';

    instanceSelect = `
                SELECT DISTINCT ?id ?label
                WHERE {
                    ${labelQuery}
                }
            `

    let q = '';
    if (countResults) {
      q = `
                SELECT (count(*) as ?count)
                ${this._sparqlNamedGraph(qp.namedGraphs)}
                where {
                    {
                        ${instanceSelect}
                    }
                }

            `
    } else {
      q = instanceSelect;
    }

   // console.warn(q)
    return q
  }
}
