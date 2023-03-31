/* eslint-disable no-console */
import {Location} from '@angular/common';
import {HttpClient} from '@angular/common/http';
import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder} from "@angular/forms";
import {MatAutocomplete} from "@angular/material/autocomplete";
import {MatAccordion} from '@angular/material/expansion';
import {ActivatedRoute, Router} from '@angular/router';
import {WorkClass, WorkMetadataClass} from "../work.class";
import {WorkFilterI, WorkOptionsI, WorkQueryParameterI, WorkService} from '../work.service';
import {BaseIndexViewDirective} from "app/shared/baseIndexComponent/view/view.component";
import {HistoryService} from "app/shared/historyService";

@Component({
  selector: 'dhpp-work-view',
  templateUrl: './work-view.component.html',
  styleUrls: ['work-view.component.scss']
})
export class WorkViewComponent extends BaseIndexViewDirective<WorkQueryParameterI, WorkFilterI, WorkOptionsI, WorkClass> implements OnInit {
  @ViewChild('accordion', {static: true}) Accordion: MatAccordion;
  @ViewChild('userInput') userInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  metadata: WorkMetadataClass;

  constructor(
    // BaseIndexComponent
    public router: Router,
    public route: ActivatedRoute,
    public locationService: Location,
    public http: HttpClient,
    public fb: FormBuilder,
    public service: WorkService, // --> service
    public history: HistoryService<WorkQueryParameterI, WorkFilterI, WorkOptionsI, WorkClass>,
  ) {
    super(router, route, locationService, http, fb, service);
  }

  ngOnInit(): void {
    super.ngOnInit();
    if (this.instance) {
      this.route.params.subscribe(params => {
        this.loadMetadata(params['id']);
        this.isLoaded = Promise.resolve(true)
      });
    }
  }

  public loadMetadata(id: string) {

    this.service.getWorkMetadata(id)
      .then(data => {
        this.isLoaded = Promise.resolve(true);
        this.metadata = data[0][0];
        console.log(this.metadata);
      })
      .catch(error => {
        // console.warn(error)
      })
  }

}
