import { Injectable, OnInit } from '@angular/core';
import { NAMEDGRAPHS } from 'app/app.constants';
import { Store, select } from '@ngrx/store';
import { Concept } from './concept.class';
import { SkosConceptService, skosFilterMap, skosOptionsMap, skosQueryParameterMap } from 'app/shared/skos/skos.service';
import { selectLanguage } from 'app/store/language.reducer';

export interface ConceptQueryParameterI extends skosQueryParameterMap<ConceptFilterI, ConceptOptionsI> {}

export interface ConceptFilterI extends skosFilterMap {}

export interface ConceptOptionsI extends skosOptionsMap {}

export const defaultConceptQP: ConceptQueryParameterI = {
  order: 'label',
  limit: 10,
  offset: 0,
  desc: false,
  lang: undefined,
  namedGraphs: NAMEDGRAPHS.get('vocab'),
  filter: {
    scheme: 'mhdbdbi:conceptualSystem'
  },
  option: {
    useLucene: false
  }
};

@Injectable({ providedIn: 'root' })
export class ConceptService extends SkosConceptService<ConceptQueryParameterI, ConceptFilterI, ConceptOptionsI, Concept> {
  protected _defaultQp: ConceptQueryParameterI = defaultConceptQP;

  constructor(public store: Store) {
    super(store);
    this.store.select(selectLanguage).subscribe(v => (this._defaultQp.lang = v));
  }

  getConceptsOfSense(senseUri: string): Promise<Concept[]> {
    const query = `
            select ?id ?label ?altLabel ?narrowerId ?broaderId
            where {
                <${senseUri}> dhpluso:isLexicalizedSenseOf ?id .
                ?id a skos:Concept .
                ?id skos:prefLabel ?label .
                OPTIONAL { ?id skos:altLabel ?altLabel . }
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
            order by ?label
        `;
    return new Promise<Concept[]>(resolve => {
      this._sq.query(query).then(data => {
        resolve(this._jsonToObject(data['results']['bindings']));
      });
    });
  }

  _sparqlQuery(qp: ConceptQueryParameterI): string {
    let results: string = super._sparqlQuery(qp as skosQueryParameterMap<ConceptFilterI, ConceptOptionsI>);
    return results;
  }

  _jsonToObject(bindings: any): Concept[] {
    let results: Concept[] = super._jsonToObject(bindings);
    return results;
  }
}
