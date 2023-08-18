/* eslint-disable no-console */
import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DictionaryService } from './dictionary.service';

@Component({
  selector: 'dhpp-dictionary',
  templateUrl: './dictionary.component.html',
  styleUrls: ['dictionary.component.scss']
})
export class DictionaryComponent implements OnInit {

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private locationService: Location,
    private http: HttpClient,
    private dictionaryService: DictionaryService,
    private fb: FormBuilder
  ) {
    // do nothing here
  }

  ngOnInit() {
  }

}
