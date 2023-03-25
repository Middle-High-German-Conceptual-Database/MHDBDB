/* eslint-disable no-console */
import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HistoryService } from '../../shared/historyService';
import { WorkClass } from '../work.class';
import { WorkFilterI, WorkOptionsI, WorkQueryParameterI, WorkService } from '../work.service';
import {BaseIndexListDirective} from "app/shared/baseIndexComponent/list/list.component";

@Component({
    selector: 'dhpp-work-list',
    templateUrl: './work-list.component.html',
    styleUrls: ['work-list.component.scss']
})
export class WorkListComponent extends BaseIndexListDirective<WorkQueryParameterI, WorkFilterI, WorkOptionsI, WorkClass> implements OnInit, OnDestroy {

    // Form
    //// Label
    labelTextSearch = 'Titel'

    constructor(
        // BaseIndexComponent
        public router: Router,
        public route: ActivatedRoute,
        public locationService: Location,
        public http: HttpClient,
        public service: WorkService, // --> service
        public history: HistoryService<WorkQueryParameterI, WorkFilterI, WorkOptionsI, WorkClass>,
        // Individual
    ) {
        super(router, route, locationService, http, service, history)
    }

}
