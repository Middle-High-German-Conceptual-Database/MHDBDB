import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Concept } from '../../../concept/concept.class';
import { ConceptFilterI, ConceptOptionsI, ConceptQueryParameterI, ConceptService } from '../../../concept/concept.service';
import { BaseIndexElementDirective } from '../../baseIndexComponent/element/element.component';

@Component({
    selector: 'dhpp-concept-element',
    templateUrl: './concept-element.component.html',
    styleUrls: ['concept-element.component.scss']
})
export class ConceptElementComponent extends BaseIndexElementDirective<Concept, ConceptQueryParameterI, ConceptFilterI, ConceptOptionsI> {
    constructor(
        public router: Router,
        public route: ActivatedRoute,
        public locationService: Location,
        public http: HttpClient,
        public service: ConceptService
    ) {
        super(router, route, locationService, http, service)
    }
}
