import {Location} from '@angular/common';
import {HttpClient} from '@angular/common/http';
import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {BaseIndexElementDirective} from '../../baseIndexComponent/element/element.component';
import {WorkClass, WorkMetadataClass} from '../../../work/work.class';
import {WorkFilterI, WorkOptionsI, WorkQueryParameterI, WorkService} from '../../../work/work.service';
import {Utils} from "app/shared/utils";
import {SenseClass, WordClass} from "app/dictionary/dictionary.class";
import {DictionaryQueryParameterI, DictionaryService} from "app/dictionary/dictionary.service";

@Component({
  selector: 'dhpp-text-element',
  templateUrl: './text-element.component.html',
  styleUrls: ['text-element.component.scss']
})
export class TextElementComponent extends BaseIndexElementDirective<WorkClass, WorkQueryParameterI, WorkFilterI, WorkOptionsI> implements OnInit {

  @Input() public instance: any;

  @Input() public qp: any;


  total: number = 0
  senses: SenseClass[] = []

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public locationService: Location,
    public http: HttpClient,
    public service: WorkService,
    public dicService: DictionaryService,
  ) {
    super(router, route, locationService, http, service)
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  /*getWorkId(): string {
    return Utils.removeNameSpace(this.instance.workId);
  }*/


}
