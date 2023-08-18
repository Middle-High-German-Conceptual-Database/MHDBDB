/* eslint-disable no-console */
import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { HistoryService } from '../../shared/historyService';
import { Concept } from '../concept.class';
import { ConceptFilterI, ConceptOptionsI, ConceptQueryParameterI, ConceptService } from '../concept.service';
import {BaseIndexTreeDirective} from "app/shared/baseIndexComponent/tree/tree.component";

@Component({
    selector: 'dhpp-concept-tree',
    templateUrl: './concept-tree.component.html',
    styleUrls: ['concept-tree.component.scss']
})
export class ConceptTreeComponent extends BaseIndexTreeDirective<ConceptQueryParameterI, ConceptFilterI, ConceptOptionsI,Concept, ConceptService> {
    eventsSubject: Subject<any> = new Subject<any>();
    @ViewChild('conceptsearch') conceptsearch: ElementRef;

    constructor(
        public router: Router,
        public route: ActivatedRoute,
        public locationService: Location,
        public http: HttpClient,
        public service: ConceptService,
        public historyService: HistoryService<ConceptQueryParameterI, ConceptFilterI, ConceptOptionsI, Concept>,
    ) {
        super(router, route, locationService, http, service, historyService)
    }
}
