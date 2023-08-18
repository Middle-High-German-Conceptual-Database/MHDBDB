/* eslint-disable no-console */
import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { OnomasticsService } from './onomastics.service';

@Component({
    selector: 'dhpp-onomastics',
    templateUrl: './onomastics.component.html',
    styleUrls: ['onomastics.component.scss']
})
export class OnomasticsComponent implements OnInit {

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private locationService: Location,
        private http: HttpClient,
        private onomasticsService: OnomasticsService,
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
