/* eslint-disable no-console */
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, DefaultUrlSerializer, PRIMARY_OUTLET, Router, UrlSegmentGroup, UrlTree } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Location } from '@angular/common';
import { ProjectService } from './project.service';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'dhpp-project',
  templateUrl: './project.component.html',
  styleUrls: ['project.component.scss']
})
export class ProjectComponent implements OnInit {

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private locationService: Location,
    private http: HttpClient,
    private workService: ProjectService,
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
