/* eslint-disable no-console */
import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder } from "@angular/forms";
import { MatAutocomplete } from "@angular/material/autocomplete";
import { MatAccordion } from '@angular/material/expansion';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseIndexViewDirective } from '../../../shared/baseIndexComponent/view/view.component';
import { WorkService } from '../../../work/work.service';
import { Person } from "../person.class";
import { PersonFilterI, PersonOptionsI, PersonQueryParameterI, PersonService } from '../person.service';

@Component({
  selector: 'dhpp-person-view',
  templateUrl: './person-view.component.html',
  styleUrls: ['person-view.component.scss']
})
export class PersonViewComponent extends BaseIndexViewDirective<PersonQueryParameterI, PersonFilterI, PersonOptionsI, Person > {
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
    public service: PersonService, // --> service
    public workService: WorkService
  ) {
    super(router, route, locationService, http, fb, service)
  }

}

