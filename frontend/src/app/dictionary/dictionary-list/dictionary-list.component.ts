/* eslint-disable no-console */
import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {ActivatedRoute, Navigation, Router} from '@angular/router';
import { HistoryService } from '../../shared/historyService';
import { WordClass } from '../dictionary.class';
import { DictionaryFilterI, DictionaryOptionsI, DictionaryQueryParameterI, DictionaryService } from '../dictionary.service';
import {BaseIndexListDirective} from "app/shared/baseIndexComponent/list/list.component";
import {take} from "rxjs/operators";
import {updateFilterById} from "app/store/filter.actions";

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

    searchTerm: string;

    navigation: Navigation;

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
        super(router, route, locationService, http, service, history);
        this.navigation = this.router.getCurrentNavigation();

        if (this.navigation?.extras.state && this.navigation.extras.state.searchTerm) {
            this.searchTerm = this.navigation.extras.state.searchTerm;
        }

    }

    search() {
       // this.isLoading = true;
    }
}
