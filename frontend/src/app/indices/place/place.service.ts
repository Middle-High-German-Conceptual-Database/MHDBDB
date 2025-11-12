/* eslint-disable object-shorthand */
import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { LanguageService, NAMEDGRAPHS } from 'app/shared/base.imports';
import { FilterIdLabelI, MhdbdbIdLabelEntityService, OptionsI, QueryParameterI } from '../../shared/mhdbdb-graph.service';
import { Place } from './place.class';
import { selectLanguage } from 'app/store/language.reducer';
import { Store, select } from '@ngrx/store';

export interface PlaceQueryParameterI extends QueryParameterI<PlaceFilterI, PlaceOptionsI> {}

export interface PlaceFilterI extends FilterIdLabelI {}

export interface PlaceOptionsI extends OptionsI {}

export const defaultPlaceQP: PlaceQueryParameterI = {
  order: 'label',
  desc: false,
  limit: 10,
  offset: 0,
  lang: undefined,
  namedGraphs: NAMEDGRAPHS.get('wd'),
  filter: {
    label: '',
    isLabelActive: true
  },
  option: {
    useLucene: false
  }
};

@Injectable({ providedIn: 'root' })
export class PlaceService extends MhdbdbIdLabelEntityService<PlaceQueryParameterI, PlaceFilterI, PlaceOptionsI, Place> {
  protected _defaultQp: PlaceQueryParameterI = defaultPlaceQP;

  constructor(public store: Store) {
    super(store);
    this.store.select(selectLanguage).subscribe(v => (this._defaultQp.lang = v));
  }

  _jsonToObject(bindings: any): Place[] {
    let results: Place[] = super._jsonToObject(bindings) as Place[];
    return results;
  }

  _sparqlQuery(qp: PlaceQueryParameterI, countResults: boolean = false): string {
    let filters = [];

    let instanceSelector = `?id a dhpluso:Place .                                                                 
                                ?id rdfs:label ?label .
                                filter(langMatches( lang(?label), "${qp.lang}" ))`;

    // label query
    let labelQuery = '';
    if (qp.filter.isLabelActive) {
      if (qp.filter.id || qp.option.useLucene === false || !('label' in qp.filter && qp.filter.label != '')) {
        labelQuery = instanceSelector;
      } else {
        // Lucene query

        labelQuery = `
                        ?search a luc-index:work ;
                        luc:query "title:${this._labelFilterGenerator(qp.filter.label, qp.option.useLucene)}" ;
                        luc:entities ?id .                            
                        `;
      }
      // Title Filter (regexp mode)
      if (!qp.filter.id && qp.option.useLucene === false && 'label' in qp.filter && qp.filter.label != '') {
        filters.push(`filter(regex(str(?label), "${this._labelFilterGenerator(qp.filter.label)}", "i"))`);
      }
    }

    let instanceSelect = '';
    if (qp.filter.id) {
      instanceSelect = `    
                SELECT DISTINCT ?id ?label
                WHERE {             
                    ${this._sparqlGenerateBinding(qp.filter.id)}
                    ${labelQuery}  
                }                
            `;
    } else {
      instanceSelect = `                       
                SELECT DISTINCT ?id ?label
                WHERE {                            
                    ${labelQuery}                                
                    ${filters.join('\n')}
                } 
            `;
    }

    let q = '';
    if (countResults) {
      q = ` (count(*) as ?count) 
                ${this._sparqlNamedGraph(qp.namedGraphs)}
                where {
                    {
                        ${instanceSelect}
                    }
                }
                
            `;
    } else {
      q = ` DISTINCT
                    ?id
                    ?label
                ${this._sparqlNamedGraph(qp.namedGraphs)}
                where {
                    {
                        ${instanceSelect}
                    }
                }
                ${this._sparqlOrder(qp.order, qp.desc)}
                ${this._sparqlLimitOffset(qp.limit, qp.offset)}                
            `;
    }
    return q;
  }
}
