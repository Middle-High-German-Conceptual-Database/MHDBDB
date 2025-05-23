/* eslint-disable object-shorthand */
import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { LanguageService, NAMEDGRAPHS } from 'app/shared/base.imports';
import { Person } from '../indices/person/person.class';
import {
  MhdbdbIdLabelEntityService,
  FilterIdI,
  FilterLabelI,
  OptionsI,
  QueryParameterI,
  SparqlBindingI
} from '../shared/mhdbdb-graph.service';
import { WorkClass, WorkMetadataClass, SeriesClass } from './work.class';
import { ElectronicText } from 'app/text/text.class';
import { Concept } from 'app/concept/concept.class';
import { WordClass } from 'app/dictionary/dictionary.class';
import { DatePrecision } from 'app/shared/baseIndexComponent/baseindexcomponent.class';
import { Store, select } from '@ngrx/store';
import { selectLanguage } from 'app/store/language.reducer';
import { Utils } from 'app/shared/utils';

export interface WorkQueryParameterI extends QueryParameterI<WorkFilterI, WorkOptionsI> {}

export interface WorkFilterI extends FilterIdI, FilterLabelI {
  authorIds?: string[];
  isAuthorIdsActive: boolean;
}

export interface WorkOptionsI extends OptionsI {
  useLucene: boolean;
}

export const defaultWorkQP: WorkQueryParameterI = {
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
};

@Injectable({ providedIn: 'root' })
export class WorkService extends MhdbdbIdLabelEntityService<WorkQueryParameterI, WorkFilterI, WorkOptionsI, WorkClass> {
  protected _defaultQp: WorkQueryParameterI = defaultWorkQP;

  constructor(public store: Store) {
    super(store);
    this.store.select(selectLanguage).subscribe(v => (this._defaultQp.lang = v));
  }

  async getWorkMetadata(workId: string): Promise<[(WorkMetadataClass[]), number]> {
    const query = `
    select distinct ?id ?label ?sameAs ?dateOfCreation ?authorId ?authorSameAs ?authorLabel ?authorRole ?instance ?instanceLabel ?expression ?expressionLabel ?genreForm ?genreFormMainParent ?bibTitle ?bibPlace ?bibAgent ?bibDate where {
            Bind(mhdbdbi:${workId} AS ?id) .
            ?id rdfs:label ?label .
            ?id owl:sameAs ?sameAs .
            ?id dcterms:created ?dateOfCreation .
            
            ?id dhpluso:contribution/dhpluso:agent ?authorId .
            ?id dhpluso:contribution/dhpluso:role <http://id.loc.gov/vocabulary/relators/aut> .
            ?id dhpluso:contribution/dhpluso:agent/rdfs:label ?authorLabel .
            ?id dhpluso:contribution/dhpluso:agent/owl:sameAs ?authorSameAs .
            
            ?id dhpluso:hasExpression/dhpluso:hasInstance ?instance .
            ?instance rdf:type dhpluso:Electronic .
            ?instance rdfs:label ?instanceLabel .

            OPTIONAL { 
              ?id dhpluso:hasExpression ?expression .
              ?expression rdfs:label ?expressionLabel .
            }

            OPTIONAL { ?id dhpluso:genreForm/skos:prefLabel ?genreForm . }
            OPTIONAL { ?id dhpluso:genreFormMainparent/skos:prefLabel ?genreFormMainParent . }

            OPTIONAL {
              ?bibId bf:instanceOf ?id .
              ?bibId bf:title/bf:mainTitle ?bibTitle .
              ?bibId bf:provisionActivity ?bibProvisionActivity .
              ?bibProvisionActivity bf:place/rdfs:label ?bibPlace .
              ?bibProvisionActivity bf:agent/rdfs:label ?bibAgent .
              ?bibProvisionActivity bf:date ?bibDate .
            }
            
            filter(langMatches( lang(?genreForm), "de" ))
            filter(langMatches( lang(?genreFormMainParent), "de" ))
            filter(langMatches( lang(?label), "de" ))
            filter(langMatches( lang(?expressionLabel), "de" ))
            filter(langMatches( lang(?instanceLabel), "de" ))
            filter(langMatches( lang(?authorLabel), "de" ))
            }
        `;
    return new Promise<[(WorkMetadataClass[]), number]>(resolve => {
      this._sq.query(query).then(data => {
        let total: number = 0;
        if (data.results.bindings && data.results.bindings.length >= 1) {
          resolve([this._jsonToObjectMeta(data.results.bindings), data.results.bindings.length]);
        } else {
          resolve([[], 0]);
        }
      });
    });
  }

  async getWorkList(): Promise<[(WorkClass[]), number]> {
    const query = `
    select distinct ?id ?label ?sameAs ?instance ?authorLabel where {
            ?id rdfs:label ?label .
            ?id owl:sameAs ?sameAs .
            ?id dhpluso:contribution/dhpluso:agent/rdfs:label ?authorLabel .
            ?id dhpluso:hasExpression/dhpluso:hasInstance ?instance .
            filter(langMatches( lang(?label), "de" ))
            filter(langMatches( lang(?authorLabel), "de" ))
            }
            ORDER BY ASC(?label)
        `;
    return new Promise<[(WorkClass[]), number]>(resolve => {
      this._sq.query(query).then(data => {
        let total: number = 0;
        if (data.results.bindings && data.results.bindings.length >= 1) {
          resolve([this._jsonToObjectMeta(data.results.bindings), data.results.bindings.length]);
        } else {
          resolve([[], 0]);
        }
      });
    });
  }

  async getSeriesParentList(): Promise<[(SeriesClass[]), number]> {
    const query = `
    select distinct ?id ?label where {
            ?id skos:topConceptOf <https://dhplus.sbg.ac.at/mhdbdb/instance/textreihentypologie> .
            ?id rdf:type skos:Concept .
            ?id skos:prefLabel ?label .
            filter(langMatches( lang(?label), "de" ))
            }
        `;
    return new Promise<[(SeriesClass[]), number]>(resolve => {
      this._sq.query(query).then(data => {
        let total: number = 0;
        if (data.results.bindings && data.results.bindings.length >= 1) {
          resolve([this._jsonToObject(data.results.bindings), data.results.bindings.length]);
        } else {
          resolve([[], 0]);
        }
      });
    });
  }

  async getSeriesList(parent: string): Promise<[(SeriesClass[]), number]> {
    const query = `
    select distinct ?id ?label where {
            ?id skos:broader <${parent}> .
            ?id rdf:type skos:Concept .
            ?id skos:prefLabel ?label .
            filter(langMatches( lang(?label), "de" ))
            }
        `;
    return new Promise<[(SeriesClass[]), number]>(resolve => {
      this._sq.query(query).then(data => {
        let total: number = 0;
        if (data.results.bindings && data.results.bindings.length >= 1) {
          resolve([this._jsonToObject(data.results.bindings), data.results.bindings.length]);
        } else {
          resolve([[], 0]);
        }
      });
    });
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

  protected _jsonToObjectMeta(bindings: SparqlBindingI[], excludeKeys?: string[]): WorkMetadataClass[] {
    let results: WorkMetadataClass[] = super._jsonToObject(bindings) as WorkMetadataClass[];
    bindings.forEach(row => {
      let element = results.find(element => element.id.toString() === row.id.value);

      if ('sameAs' in row && element && !element.sameAs) {
        let broaderList: string[] = [];
        broaderList.push(row.sameAs.value);
        element.sameAs = broaderList;
      } else if ('sameAs' in row && element && !element.sameAs.includes(row.sameAs.value)) {
        element.sameAs.push(row.sameAs.value);
      }

      if ('authorSameAs' in row && element && !element.authorSameAs) {
        let broaderList: string[] = [];
        broaderList.push(row.authorSameAs.value);
        element.authorSameAs = broaderList;
      } else if ('authorSameAs' in row && element && !element.authorSameAs.includes(row.authorSameAs.value)) {
        element.authorSameAs.push(row.authorSameAs.value);
      }

      if ('instance' in row && element && !element.instances) {
        let broaderList: string[] = [];
        broaderList.push(row.instance.value);
        element.instances = broaderList;
      } else if ('instance' in row && element && !element.instances.includes(row.instance.value)) {
        element.instances.push(row.instance.value);
      }

      if ('instanceLabel' in row && element && !element.instanceLabels) {
        let broaderList: string[] = [];
        broaderList.push(row.instanceLabel.value);
        element.instanceLabels = broaderList;
      } else if ('instanceLabel' in row && element && !element.instanceLabels.includes(row.instanceLabel.value)) {
        element.instanceLabels.push(row.instanceLabel.value);
      }

      if ('expression' in row && element && !element.expressions) {
        let broaderList: string[] = [];
        broaderList.push(row.expression.value);
        element.expressions = broaderList;
      } else if ('expression' in row && element && !element.expressions.includes(row.expression.value)) {
        element.expressions.push(row.expression.value);
      }

      if ('expressionLabel' in row && element && !element.expressionLabels) {
        let broaderList: string[] = [];
        broaderList.push(row.expressionLabel.value);
        element.expressionLabels = broaderList;
      } else if ('expressionLabel' in row && element && !element.expressionLabels.includes(row.expressionLabel.value)) {
        element.expressionLabels.push(row.expressionLabel.value);
      }

      if ('dateOfCreation' in row && element && !element.dateOfCreation) {
        element.dateOfCreation = new DatePrecision(row.dateOfCreation.value, row.dateOfCreation.value);
      }

      if ('authorLabel' in row && element && !element.authorLabel) {
        element.authorLabel = row.authorLabel.value;
      }

      if ('authorSameAs' in row && element && !element.authorSameAs) {
        element.authorSameAs = row.authorSameAs.value;
      }

      if ('genreForm' in row && element && !element.genreForm) {
        let broaderList: string[] = [];
        broaderList.push(row.genreForm.value);
        element.genreForm = broaderList;
      } else if ('genreForm' in row && element && !element.genreForm.includes(row.genreForm.value)) {
        element.genreForm.push(row.genreForm.value);
      }

      if ('genreFormMainParent' in row && element && !element.genreFormMainParent) {
        let broaderList: string[] = [];
        broaderList.push(row.genreFormMainParent.value);
        element.genreFormMainParent = broaderList;
      } else if ('genreFormMainParent' in row && element && !element.genreFormMainParent.includes(row.genreFormMainParent.value)) {
        element.genreFormMainParent.push(row.genreFormMainParent.value);
      }

      if ('bibTitle' in row && element && !element.bibTitle) {
        element.bibTitle = row.bibTitle.value;
      }

      if ('bibPlace' in row && element && !element.bibPlace) {
        element.bibPlace = row.bibPlace.value;
      }

      if ('bibAgent' in row && element && !element.bibAgent) {
        element.bibAgent = row.bibAgent.value;
      }

      if ('bibDate' in row && element && !element.bibDate) {
        element.bibDate = row.bibDate.value;
      }

      /* if (element && !element.authors) {
          const authorElem = new Person(
            row.authorId.value,
            row.authorLabel.value,
          )
          let authorList: Person[] = []
          authorList.push(authorElem)
          element.authors = authorList
        } else if (element && element.authors.find(authorElem => authorElem.id === row.authorId.value)) {
          const authorElem = new Person(
            row.authorId.value,
            row.authorLabel.value,
          )
          element.authors.push(authorElem)
        }*/
    });
    return results;
  }

  _jsonToObject(bindings: any): WorkClass[] {
    let results: WorkClass[] = super._jsonToObject(bindings) as WorkClass[];

    bindings.forEach(
      item => {
        let element = results.find(element => element.id === item.id.value)
        element.authorLabel = item.authorLabel.value;
        element.authorId = item.authorId.value;
        element.textId = Utils.removeNameSpaceFromTextUri(item.text.value);
        element.workId = item.id.value;
      }
    ); 
    return results;
  }

  protected _sparqlQuery(qp: WorkQueryParameterI, countResults: boolean): string {

    let authorFilter = `{
      ?id dhpluso:contribution/dhpluso:agent ?authorIdA .
      ?authorIdA rdfs:label ?authorLabelA .
    }`;
    if (qp.filter.isAuthorIdsActive && qp.filter.authorIds.length > 0) {
      const authorIds = qp.filter.authorIds.map(id => `<${id}>`).join(' ');
      authorFilter = `{
        ?id dhpluso:contribution/dhpluso:agent ?authorIdA .
        ?authorIdA rdfs:label ?authorLabelA .
        VALUES ?authorIdA { ${authorIds} } 
    }`;
    }

    let instanceSelector = `?id a dhpluso:Text ;
                                    dhpluso:hasExpression ?textA .
                                ?textA a dhpluso:Text .
                                ?electronic dhpluso:instanceOf ?textA ;
                                    a dhpluso:Electronic .
                                   ${authorFilter}

                                ?id rdfs:label ?labelA .
                                
                                filter(langMatches( lang(?authorLabelA), "${qp.lang}" ))
                                filter(langMatches( lang(?labelA), "${qp.lang}" ))
                                FILTER regex(?labelA, "${qp.filter.label}", "i")
                                `;

    let labelQuery = '';
    labelQuery = instanceSelector;

    let instanceSelect = '';

    instanceSelect = `
                SELECT DISTINCT (SAMPLE(?id) AS ?id) (SAMPLE(?labelA) as ?label) (?textA AS ?text) (SAMPLE(?authorLabelA) AS ?authorLabel) (SAMPLE(?authorIdA) AS ?authorId)
                WHERE {
                    ${labelQuery}
                }
                GROUP BY ?textA
                ORDER BY ASC(?label)
            `;

    let q = '';
    if (countResults) {
      q = `
                SELECT (count(*) as ?count)
                where {
                    {
                        ${instanceSelect}
                    }
                }

            `;
    } else {
      q = instanceSelect;
    }
    console.warn(q);
    return q;
  }
}
