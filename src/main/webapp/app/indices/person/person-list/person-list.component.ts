/* eslint-disable no-console */
import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseIndexListDirective } from '../../../shared/baseIndexComponent/list/list.component';
import { HistoryService } from '../../../shared/historyService';
import { Person } from '../person.class';
import { PersonFilterI, PersonOptionsI, PersonQueryParameterI, PersonService } from '../person.service';

@Component({
    selector: 'dhpp-person-list',
    templateUrl: './person-list.component.html',
    styleUrls: ['person-list.component.scss']
})
export class PersonListComponent extends BaseIndexListDirective<PersonQueryParameterI, PersonFilterI, PersonOptionsI, Person> implements OnInit {

    
    // Form
    //// Label
    labelTextSearch = 'Name'    

    constructor(
        // BaseIndexComponent
        public router: Router,
        public route: ActivatedRoute,
        public locationService: Location,
        public http: HttpClient,
        public service: PersonService, // --> service
        public history: HistoryService<PersonQueryParameterI, PersonFilterI, PersonOptionsI, Person>
    ) {
        super(router, route, locationService, http, service, history)
    }

}
