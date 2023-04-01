import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ListHistoryEntry } from '../../shared/history.class';
import { HistoryService } from '../../shared/historyService';
import {ElectronicText, TextPassage} from '../reference.class';
import { TokenFilterI, TextPassageFilterI, TextPassageOptionsI, TextPassageQueryParameterI, TextPassageService, defaultTokenFilter } from '../referencePassage.service';
import {BaseIndexListDirective} from "app/shared/baseIndexComponent/list/list.component";
import {
  TextFilterI,
  TextOptionsI,
  TextQueryParameterI,
  TextService
} from "app/reference/reference.service";

@Component({
    selector: 'dhpp-reference-list',
    templateUrl: './reference-list.component.html',
    styleUrls: ['reference-list.component.scss']
})
export class TextListComponent extends BaseIndexListDirective<TextQueryParameterI, TextFilterI, TextOptionsI, ElectronicText> {

  filters: any[] = [{ id: 1, name: 'erster filter'}];
  labelTextSearch = 'Lemma';
  labelPosSearch = 'Wortart';
  labelConceptSearch = 'Begriffe';

  labelAuthorSearch = 'AutorIn';
  tokenFilter?: TokenFilterI;

  constructor(
        public router: Router,
        public route: ActivatedRoute,
        public locationService: Location,
        public http: HttpClient,
        public service: TextService, // --> service
        public history: HistoryService<TextQueryParameterI, TextFilterI, TextOptionsI, ElectronicText>,

    ) {
        super(router, route, locationService, http, service, history)
    }

    ////////////////////
    // Requests
    ////////////////////

  public addFilter() {
    this.filters.push({ id: 2, name: 'zweiter filter' });
  }

  public removeFilter(i: number) {
    this.filters.splice(i, 1);
  }


}
