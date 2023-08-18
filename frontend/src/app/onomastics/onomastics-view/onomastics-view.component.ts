/* eslint-disable no-console */
import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { FormBuilder } from "@angular/forms";
import { MatAutocomplete } from '@angular/material/autocomplete';
import { MatAccordion } from '@angular/material/expansion';
import { ActivatedRoute, Router } from '@angular/router';
import { NAMESPACES } from 'app/app.constants';
import { NameConcept } from "../onomastics.class";
import { NameConceptFilterI, NameConceptOptionsI, NameConceptQueryParameterI, OnomasticsService } from '../onomastics.service';
import { TextService } from "app/text/text.service"
import { Kwic } from 'app/text/text.class';
import {BaseIndexViewDirective} from "app/shared/baseIndexComponent/view/view.component";

@Component({
    selector: 'dhpp-onomastics-view',
    templateUrl: './onomastics-view.component.html',
    styleUrls: ['onomastics-view.component.scss']
})
export class OnomasticsViewComponent extends BaseIndexViewDirective<NameConceptQueryParameterI, NameConceptFilterI, NameConceptOptionsI, NameConcept> {
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
        public service: OnomasticsService, // --> service
        public textService: TextService
    ) {
        super(router, route, locationService, http, fb, service)
    }
}
