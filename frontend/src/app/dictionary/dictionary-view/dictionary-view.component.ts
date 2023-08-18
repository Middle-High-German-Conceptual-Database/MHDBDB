/* eslint-disable no-console */
import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder } from "@angular/forms";
import { MatAutocomplete } from '@angular/material/autocomplete';
import { MatAccordion } from '@angular/material/expansion';
import { ActivatedRoute, Router } from '@angular/router';
import { WordClass } from "../dictionary.class";
import { DictionaryFilterI, DictionaryOptionsI, DictionaryQueryParameterI, DictionaryService } from '../dictionary.service';
import {BaseIndexViewDirective} from "app/shared/baseIndexComponent/view/view.component";

@Component({
    selector: 'dhpp-dictionary-view',
    templateUrl: './dictionary-view.component.html',
    styleUrls: ['dictionary-view.component.scss']
})
export class DictionaryViewComponent extends BaseIndexViewDirective<DictionaryQueryParameterI, DictionaryFilterI, DictionaryOptionsI, WordClass> {
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
        public service: DictionaryService,
    ) {
        super(router, route, locationService, http, fb, service)
    }
}
