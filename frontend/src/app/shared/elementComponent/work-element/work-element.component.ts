import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {Component, Input, OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseIndexElementDirective } from '../../baseIndexComponent/element/element.component';
import {WorkClass, WorkMetadataClass} from '../../../work/work.class';
import { WorkFilterI, WorkOptionsI, WorkQueryParameterI, WorkService } from '../../../work/work.service';

@Component({
    selector: 'dhpp-work-element',
    templateUrl: './work-element.component.html',
    styleUrls: ['work-element.component.scss']
})
export class WorkElementComponent extends BaseIndexElementDirective<WorkClass, WorkQueryParameterI, WorkFilterI, WorkOptionsI> implements OnInit {

  @Input() public instance: any;

  constructor(
        public router: Router,
        public route: ActivatedRoute,
        public locationService: Location,
        public http: HttpClient,
        public service: WorkService
    ) {
        super(router, route, locationService, http, service)
    }

  ngOnInit(): void {
    super.ngOnInit();
  }

}
