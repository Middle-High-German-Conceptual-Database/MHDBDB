import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseIndexElementDirective } from '../../baseIndexComponent/element/element.component';
import { NameConcept } from '../../../onomastics/onomastics.class';
import { NameConceptFilterI, NameConceptOptionsI, NameConceptQueryParameterI, OnomasticsService } from '../../../onomastics/onomastics.service';

@Component({
  selector: 'dhpp-onomastics-element',
  templateUrl: './onomastics-element.component.html',
  styleUrls: ['onomastics-element.component.scss']
})
export class OnomasticsElementComponent extends BaseIndexElementDirective<NameConcept,NameConceptQueryParameterI,NameConceptFilterI,NameConceptOptionsI> {
    @Input() instance: NameConcept;
    constructor(
        public router: Router,
        public route: ActivatedRoute,
        public locationService: Location,
        public http: HttpClient,
        public service: OnomasticsService
    ) {
        super(router, route, locationService, http,service)
    }
}
