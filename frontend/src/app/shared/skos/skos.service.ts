import { Store, select } from '@ngrx/store';
import { SkosConceptI } from '../baseIndexComponent/baseindexcomponent.class';
import {
  FilterIdLabelI,
  FilterSkosI,
  MhdbdbIdLabelEntityService,
  OptionsI,
  QueryParameterI,
  SparqlBindingI
} from '../mhdbdb-graph.service';
import { SkosConcept } from './skos.class';

export interface skosQueryParameterMap<f extends skosFilterMap, o extends skosOptionsMap> extends QueryParameterI<f, o> {}

export interface skosFilterMap extends FilterIdLabelI, FilterSkosI {}

export interface skosOptionsMap extends OptionsI {}

export interface SkosConceptServiceI<
  P extends skosQueryParameterMap<F, O>,
  F extends skosFilterMap,
  O extends skosOptionsMap,
  E extends SkosConcept
> extends MhdbdbIdLabelEntityService<P, F, O, E> {
  readonly concepts: SkosConceptI[];
  readonly topConcepts: SkosConceptI[];
  readonly rootConcept: string;
  getAllConcepts(): Promise<SkosConceptI[]>;
  getTopConcepts(): Promise<SkosConceptI[]>;
  getNarrowerConcepts(uri: string): Promise<SkosConceptI[]>;
}
export abstract class SkosConceptService<
  P extends skosQueryParameterMap<F, O>,
  F extends skosFilterMap,
  O extends skosOptionsMap,
  E extends SkosConcept
> extends MhdbdbIdLabelEntityService<P, F, O, E> implements SkosConceptServiceI<P, F, O, E> {
  protected _concepts: SkosConceptI[];
  protected _topConcepts: SkosConceptI[];
  protected _rootConcept: string = undefined;
  public get concepts(): SkosConceptI[] {
    return this._concepts;
  }
  public get topConcepts(): SkosConceptI[] {
    return this._topConcepts;
  }
  public get rootConcept(): string {
    return this._rootConcept;
  }

  constructor(public store: Store) {
    super(store);
  }

  getAllConcepts(): Promise<SkosConceptI[]> {
    let qp: P = this.defaultQp;
    qp.limit = undefined;
    const query = this._sparqlQuery(qp);
    return new Promise<SkosConceptI[]>(resolve => {
      if (!this._concepts) {
        this._sq.query(query).then(data => {
          if (data && data['results'] && data['results']['bindings']) {
            this._concepts = this._jsonToObject(data['results']['bindings']);
            resolve(this._concepts);
          }
        });
      } else {
        resolve(this._concepts);
      }
    });
  }

  getTopConcepts(): Promise<SkosConceptI[]> {
    let qp: P = this.defaultQp;
    if (this.rootConcept) {
      qp.filter.broader = this.rootConcept;
    } else {
      qp.filter.topConcepts = true;
    }
    qp.limit = undefined;
    const query = this._sparqlQuery(qp);
    return new Promise<SkosConceptI[]>(resolve => {
      if (!this._topConcepts) {
        this._sq.query(query).then(data => {
          if (data && data['results'] && data['results']['bindings']) {
            this._topConcepts = this._jsonToObject(data['results']['bindings']);
            resolve(this._topConcepts);
          }
        });
      } else {
        resolve(this._topConcepts);
      }
    });
  }

  getNarrowerConcepts(uri: string): Promise<SkosConceptI[]> {
    let qp: P = JSON.parse(JSON.stringify(this._defaultQp));
    qp.filter.broader = uri;
    qp.limit = 0;
    const query = this._sparqlQuery(qp);
    return new Promise<SkosConceptI[]>(resolve => {
      this._sq.query(query).then(data => {
        if (data && data['results'] && data['results']['bindings']) {
          this._topConcepts = this._jsonToObject(data['results']['bindings']);
          resolve(this._topConcepts);
        }
      });
    });
  }

  protected _sparqlQuery(qp: P): string {
    // filters
    let filters = [];
    if ('label' in qp.filter && qp.filter.label != '') {
      filters.push(`filter(regex(str(?label), "${this._labelFilterGenerator(qp.filter.label)}", "i"))`);
    }

    let broader = '';
    if ('broader' in qp.filter && qp.filter.broader != '') {
      if (qp.filter.broader.startsWith('http:') || qp.filter.broader.startsWith('https:')) {
        broader = `?id skos:broader <${qp.filter.broader}> .`;
      } else {
        broader = `?id skos:broader ${qp.filter.broader} .`;
      }
    }

    let scheme = '';
    if ('scheme' in qp.filter && qp.filter.scheme != '') {
      scheme = `?id skos:inScheme ${qp.filter.scheme} .`;
    }

    let topConcepts = '';
    if ('topConcepts' in qp.filter && qp.filter.topConcepts && !('broader' in qp.filter && qp.filter.broader)) {
      topConcepts = `${qp.filter.scheme} skos:hasTopConcept ?id.`;
    }

    return `
        SELECT DISTINCT ?id ?label ?broaderId ?narrowerId
        WHERE {
            # Bindings
            ${this._sparqlGenerateBinding(qp.filter.id)}
            Bind('${qp.lang}' AS ?lang)

            # ID + Label
            ?id a skos:Concept .

            ${broader}
            ${scheme}
            ${topConcepts}
            ?id skos:prefLabel ?label .
            ${filters.join('\n')}
            OPTIONAL {
                ?id skos:broader ?broaderId .
                FILTER NOT EXISTS {
                    ?broaderId owl:deprecated ?bdp .
                }
            }
            OPTIONAL {
                ?narrowerId skos:broader ?id .
                FILTER NOT EXISTS {
                    ?narrowerId owl:deprecated ?ndp .
                }
            }

            FILTER NOT EXISTS {
                ?id owl:deprecated ?dp .
            }

        }
        ${this._sparqlOrder(qp.order, qp.desc)}
        ${this._sparqlLimitOffset(qp.limit, qp.offset)}
        `;
  }

  protected _jsonToObject(bindings: SparqlBindingI[], excludeKeys?: string[]): E[] {
    let results: E[] = super._jsonToObject(bindings);
    bindings.forEach(row => {
      let element = results.find(element => element.id.toString() === row.id.value);
      if ('broaderId' in row && element && !element.broaderIds) {
        let broaderList: string[] = [];
        broaderList.push(row.broaderId.value);
        element.broaderIds = broaderList;
      } else if ('broaderId' in row && element && !element.broaderIds.includes(row.broaderId.value)) {
        element.broaderIds.push(row.broaderId.value);
      }
      if ('narrowerId' in row && element && !element.narrowerIds) {
        let narrowerList: string[] = [];
        narrowerList.push(row.narrowerId.value);
        element.narrowerIds = narrowerList;
      } else if ('narrowerId' in row && element && !element.narrowerIds.includes(row.narrowerId.value)) {
        element.narrowerIds.push(row.narrowerId.value);
      }
    });
    return results;
  }
}
