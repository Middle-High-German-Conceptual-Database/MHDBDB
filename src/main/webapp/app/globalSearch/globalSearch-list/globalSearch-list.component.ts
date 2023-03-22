/* eslint-disable no-console */
import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IdLabelI } from '../../shared/baseIndexComponent/baseindexcomponent.class';
import { BaseIndexListDirective } from '../../shared/baseIndexComponent/list/list.component';
import { HistoryService } from '../../shared/historyService';
import { classFilterT } from '../../shared/mhdbdb-graph.service';
import { GlobalSearchEntityClass } from '../globalSearch.class';
import { GlobalSearchFilterI, GlobalSearchOptionsI, GlobalSearchQueryParameterI, GlobalSearchService } from '../globalSearch.service';

@Component({
    selector: 'dhpp-globalSearch-list',
    templateUrl: './globalSearch-list.component.html',
    styleUrls: ['globalSearch-list.component.scss']
})
export class GlobalSearchListComponent extends BaseIndexListDirective<GlobalSearchQueryParameterI, GlobalSearchFilterI, GlobalSearchOptionsI, IdLabelI> implements OnInit, OnDestroy {


    // Form
    //// Label
    labelTextSearch = 'Label'  
    labelClassSearch = 'Typ'   

    //Types
    personType= 'Person' as unknown as classFilterT
    placeType = 'Place' as unknown as classFilterT
    workType = 'Work' as unknown as classFilterT
    wordType = 'Word' as unknown as classFilterT
    conceptualSystemType = 'conceptualSystem' as unknown as classFilterT
    nameSystemType = 'nameSystem' as unknown as classFilterT


    constructor(
        // BaseIndexComponent
        public router: Router,
        public route: ActivatedRoute,
        public locationService: Location,
        public http: HttpClient,
        public service: GlobalSearchService, // --> service
        public history: HistoryService<GlobalSearchQueryParameterI, GlobalSearchFilterI, GlobalSearchOptionsI, GlobalSearchEntityClass>,
        // Individual      
    ) {
        super(router, route, locationService, http, service, history)
        this.routeString = 'globalSearch'
    }
    
}
