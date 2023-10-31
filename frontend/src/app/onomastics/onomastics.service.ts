import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { NAMEDGRAPHS } from 'app/app.constants';
import { LanguageService } from 'app/shared/language.service';
import { NameConcept } from './onomastics.class';
import { SkosConceptService, skosFilterMap, skosOptionsMap, skosQueryParameterMap } from 'app/shared/skos/skos.service';
import { selectLanguage } from 'app/store/language.reducer';
import { Store, select } from '@ngrx/store';
import {Concept} from "app/concept/concept.class";

export interface NameConceptQueryParameterI extends skosQueryParameterMap<NameConceptFilterI, NameConceptOptionsI> {}

export interface NameConceptFilterI extends skosFilterMap {}

export interface NameConceptOptionsI extends skosOptionsMap {}

export const defaultOnomasticsQP: NameConceptQueryParameterI = {
  order: 'label',
  desc: false,
  limit: 10,
  offset: 0,
  lang: undefined,
  namedGraphs: NAMEDGRAPHS.get('vocab'),
  filter: {
    scheme: 'mhdbdbi:nameSystem'
  },
  option: {
    useLucene: false
  }
};

@Injectable({ providedIn: 'root' })
export class OnomasticsService extends SkosConceptService<
  NameConceptQueryParameterI,
  NameConceptFilterI,
  NameConceptOptionsI,
  NameConcept
> {
  protected _defaultQp: NameConceptQueryParameterI = defaultOnomasticsQP;

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

  _sparqlQuery(qp: NameConceptQueryParameterI): string {
    let results: string = super._sparqlQuery(qp as skosQueryParameterMap<NameConceptFilterI, NameConceptOptionsI>);
    return results;
  }

  _jsonToObject(bindings: any): NameConcept[] {
    let results: NameConcept[] = super._jsonToObject(bindings);
    return results;
  }
}
