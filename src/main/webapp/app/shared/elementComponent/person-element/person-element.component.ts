import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Person } from '../../../indices/person/person.class';
import { PersonFilterI, PersonOptionsI, PersonQueryParameterI, PersonService } from '../../../indices/person/person.service';
import { BaseIndexElementDirective } from '../../baseIndexComponent/element/element.component';

@Component({
    selector: 'dhpp-person-element',
    templateUrl: './person-element.component.html',
    styleUrls: ['person-element.component.scss']
})
export class PersonElementComponent extends BaseIndexElementDirective<Person, PersonQueryParameterI, PersonFilterI,PersonOptionsI> {

    constructor(
      public router: Router,
      public route: ActivatedRoute,
      public locationService: Location,
      public http: HttpClient,
      public service: PersonService
    ) {
      super(router, route, locationService, http, service)
    }
}
