import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { NAMEDGRAPHS } from 'app/app.constants';
import { LanguageService } from 'app/shared/language.service';
import { NameConcept } from './onomastics.class';
import { SkosConceptService, skosFilterMap, skosOptionsMap, skosQueryParameterMap } from 'app/shared/skos/skos.service';
import { selectLanguage } from 'app/store/language.reducer';
import { Store, select } from '@ngrx/store';

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

  _sparqlQuery(qp: NameConceptQueryParameterI): string {
    let results: string = super._sparqlQuery(qp as skosQueryParameterMap<NameConceptFilterI, NameConceptOptionsI>);
    return results;
  }

  _jsonToObject(bindings: any): NameConcept[] {
    let results: NameConcept[] = super._jsonToObject(bindings);
    return results;
  }
}