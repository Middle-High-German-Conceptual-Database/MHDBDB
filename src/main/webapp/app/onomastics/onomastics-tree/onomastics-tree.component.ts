/* eslint-disable no-console */
import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { HistoryService } from '../../shared/historyService';
import { NameConcept } from '../onomastics.class';
import { NameConceptFilterI, NameConceptOptionsI, NameConceptQueryParameterI, OnomasticsService } from '../onomastics.service';
import {BaseIndexTreeDirective} from "app/shared/baseIndexComponent/tree/tree.component";

@Component({
    selector: 'dhpp-onomastics-tree',
    templateUrl: './onomastics-tree.component.html',
    styleUrls: ['onomastics-tree.component.scss']
})
export class OnomasticsTreeComponent extends BaseIndexTreeDirective<NameConceptQueryParameterI, NameConceptFilterI, NameConceptOptionsI, NameConcept, OnomasticsService> {
    constructor(
        public router: Router,
        public route: ActivatedRoute,
        public locationService: Location,
        public http: HttpClient,
        public service: OnomasticsService,
        public historyService: HistoryService<NameConceptQueryParameterI, NameConceptFilterI, NameConceptOptionsI, NameConcept>,
    ) {
        super(router, route, locationService, http, service, historyService)
    }
}
