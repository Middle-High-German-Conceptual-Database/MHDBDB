import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { LanguageService, NAMEDGRAPHS } from 'app/shared/base.imports';
import { FilterIdI, MhdbdbGraphService, QueryParameterI } from '../mhdbdb-graph.service';
import { SkosConceptService, skosFilterMap, skosQueryParameterMap, skosOptionsMap} from '../skos/skos.service'
import { PoS } from './pos.class';

export interface PosQueryParameterI extends skosQueryParameterMap<PosFilterI, PosOptionI> {
    filter: PosFilterI,
    option: PosOptionI
}

export interface PosFilterI extends skosFilterMap {

}

export interface PosOptionI extends skosOptionsMap {

}

export const defaultPosQP: PosQueryParameterI =
{
    order: 'label',
    desc: false,
    limit: 10,
    offset: 0,
    lang: undefined,
    namedGraphs: NAMEDGRAPHS.get('vocab'),
    filter: {
        scheme: "mhdbdbi:PosTags",
        isLabelActive: true
    },
    option: {
        useLucene: false
    }
}

@Injectable({ providedIn: 'root' })
export class PosService extends SkosConceptService<PosQueryParameterI, PosFilterI, PosOptionI, PoS> {    
    protected _defaultQp: PosQueryParameterI = defaultPosQP;

    constructor(
        protected _languageService: LanguageService,
    ) {
        super(_languageService)
        this._languageService.getCurrent().then(v => this._defaultQp.lang = v)
        this._rootConcept = "mhdbdbi:PartOfSpeech"
    }

    sparqlQuery(qp: PosQueryParameterI): string {
        let results: string = super._sparqlQuery(qp as PosQueryParameterI)
        return results
    }

    jsonToObject(bindings: any): PoS[] {
        let results: PoS[] = super._jsonToObject(bindings)
        return results
    }
}    