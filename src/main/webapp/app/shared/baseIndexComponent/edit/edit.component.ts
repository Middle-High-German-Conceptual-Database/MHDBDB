import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, DefaultUrlSerializer, PRIMARY_OUTLET, Router, UrlSegmentGroup, UrlTree, ParamMap } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Location } from '@angular/common';
import { Subject } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'dhpp-baseindexcomponent-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['edit.component.scss']
})
export class BaseIndexEditComponent implements OnInit {
  eventsSubject: Subject<any> = new Subject<any>();
  @Input() element: any;
  rdfData: any;

  writtenRep: string;
  pos: string;
  id: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private locationService: Location,
    private http: HttpClient
  ) {
  }

  ngOnInit() {

    // Mapping
    this.writtenRep = this.element['writtenRep'].value;
    this.pos = this.element['pos'].value;

  }

  previousPage() {
    this.locationService.back();
  }

  emitEventToChild(data: any) {
    this.eventsSubject.next(data);
  }

}
