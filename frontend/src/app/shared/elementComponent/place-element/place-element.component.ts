import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { Place } from '../../../indices/place/place.class';
import { BaseIndexElementDirective } from '../../baseIndexComponent/element/element.component';
import { PlaceFilterI, PlaceOptionsI, PlaceQueryParameterI, PlaceService } from '../../../indices/place/place.service';

@Component({
    selector: 'dhpp-place-element',
    templateUrl: './place-element.component.html',
    styleUrls: ['place-element.component.scss']
})
export class PlaceElementComponent extends BaseIndexElementDirective<Place, PlaceQueryParameterI, PlaceFilterI, PlaceOptionsI> {

    constructor(
        public router: Router,
        public route: ActivatedRoute,
        public locationService: Location,
        public http: HttpClient,
        public service: PlaceService
    ) {
        super(router, route, locationService, http, service)
    }

}
