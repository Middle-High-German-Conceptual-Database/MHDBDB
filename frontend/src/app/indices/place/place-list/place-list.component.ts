/* eslint-disable no-console */
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, DefaultUrlSerializer, PRIMARY_OUTLET, Router, UrlSegmentGroup, UrlTree } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Location } from '@angular/common';
import { PlaceService, PlaceFilterI, PlaceQueryParameterI, PlaceOptionsI } from '../place.service';
import { Subject } from 'rxjs';
import { FormControl, FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { Place } from '../place.class';
import { HistoryService } from '../../../shared/historyService';
import {BaseIndexListDirective} from "app/shared/baseIndexComponent/list/list.component";

@Component({
    selector: 'dhpp-place-list',
    templateUrl: './place-list.component.html',
    styleUrls: ['place-list.component.scss']
})
export class PlaceListComponent extends BaseIndexListDirective<PlaceQueryParameterI, PlaceFilterI, PlaceOptionsI, Place> implements OnInit {
    // Form
    //// Label
    labelTextSearch = 'Name'

    constructor(
        // BaseIndexComponent
        public router: Router,
        public route: ActivatedRoute,
        public locationService: Location,
        public http: HttpClient,
        public service: PlaceService, // --> service
        public history: HistoryService<PlaceQueryParameterI, PlaceFilterI, PlaceOptionsI, Place>
    ) {
        super(router, route, locationService, http, service, history)
    }

}
