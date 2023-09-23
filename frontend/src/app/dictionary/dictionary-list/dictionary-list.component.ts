/* eslint-disable no-console */
import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HistoryService } from '../../shared/historyService';
import { WordClass } from '../dictionary.class';
import { DictionaryFilterI, DictionaryOptionsI, DictionaryQueryParameterI, DictionaryService } from '../dictionary.service';
import {BaseIndexListDirective} from "app/shared/baseIndexComponent/list/list.component";

@Component({
    selector: 'dhpp-dictionary-list',
    templateUrl: './dictionary-list.component.html',
    styleUrls: ['dictionary-list.component.scss']
})
export class DictionaryListComponent extends BaseIndexListDirective<DictionaryQueryParameterI, DictionaryFilterI, DictionaryOptionsI, WordClass> implements OnInit, OnDestroy {

    // Form
    //// Label
    labelTextSearch = 'Lemma'
    //// Pos
    labelPosSearch = 'Wortart'
    //// Concepts
    labelConceptSearch = 'Begriffe'

    constructor(
        // BaseIndexComponent
        public router: Router,
        public route: ActivatedRoute,
        public locationService: Location,
        public http: HttpClient,
        public service: DictionaryService, // --> service
        public history: HistoryService<DictionaryQueryParameterI, DictionaryFilterI, DictionaryOptionsI, WordClass>,
        // Individual
    ) {
        super(router, route, locationService, http, service, history)
    }

    search() {
       // this.isLoading = true;
    }
}
