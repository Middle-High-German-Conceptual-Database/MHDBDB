/* eslint-disable no-console */
import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder } from "@angular/forms";
import { MatAutocomplete } from "@angular/material/autocomplete";
import { MatAccordion } from '@angular/material/expansion';
import { ActivatedRoute, Router } from '@angular/router';
import { WorkClass } from "../work.class";
import { WorkFilterI, WorkOptionsI, WorkQueryParameterI, WorkService } from '../work.service';
import {BaseIndexViewDirective} from "app/shared/baseIndexComponent/view/view.component";

@Component({
    selector: 'dhpp-work-view',
    templateUrl: './work-view.component.html',
    styleUrls: ['work-view.component.scss']
})
export class WorkViewComponent extends BaseIndexViewDirective<WorkQueryParameterI, WorkFilterI, WorkOptionsI, WorkClass> {
    @ViewChild('accordion', { static: true }) Accordion: MatAccordion;
    @ViewChild('userInput') userInput: ElementRef<HTMLInputElement>;
    @ViewChild('auto') matAutocomplete: MatAutocomplete;

    constructor(
        // BaseIndexComponent
        public router: Router,
        public route: ActivatedRoute,
        public locationService: Location,
        public http: HttpClient,
        public fb: FormBuilder,
        public service: WorkService, // --> service
    ) {
        super(router, route, locationService, http, fb, service)
    }

}
