/* eslint-disable no-console */
import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder } from "@angular/forms";
import { MatAutocomplete } from "@angular/material/autocomplete";
import { MatAccordion } from '@angular/material/expansion';
import { ActivatedRoute, Router } from '@angular/router';
import { Place } from "../place.class";
import { PlaceFilterI, PlaceOptionsI, PlaceQueryParameterI, PlaceService } from '../place.service';
import {BaseIndexViewDirective} from "app/shared/baseIndexComponent/view/view.component";

@Component({
  selector: 'dhpp-place-view',
  templateUrl: './place-view.component.html',
  styleUrls: ['place-view.component.scss']
})
export class PlaceViewComponent extends BaseIndexViewDirective<PlaceQueryParameterI, PlaceFilterI, PlaceOptionsI, Place> {
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
    public service: PlaceService, // --> service
  ) {
    super(router, route, locationService, http, fb, service)
  }
}

