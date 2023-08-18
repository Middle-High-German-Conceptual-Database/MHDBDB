/* eslint-disable no-console */
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, DefaultUrlSerializer, PRIMARY_OUTLET, Router, UrlSegmentGroup, UrlTree } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Location } from '@angular/common';
import { TextService } from './reference.service';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'dhpp-reference',
    templateUrl: './reference.component.html',
    styleUrls: ['reference.component.scss']
})
export class TextComponent implements OnInit {

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private locationService: Location,
    private http: HttpClient,
      private workService: TextService,
    private fb: FormBuilder
  ) {
    // do nothing here
  }

  ngOnInit() {
  }

  previousPage() {
    this.locationService.back();
  }

}
