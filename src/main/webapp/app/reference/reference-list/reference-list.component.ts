import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ListHistoryEntry } from '../../shared/history.class';
import { HistoryService } from '../../shared/historyService';
import { TextPassage } from '../reference.class';
import { TokenFilterI, TextPassageFilterI, TextPassageOptionsI, TextPassageQueryParameterI, TextPassageService, defaultTokenFilter } from '../../text/textPassage.service';
import { TextService } from '../../reference/reference.service';
import {BaseIndexListDirective} from "app/shared/baseIndexComponent/list/list.component";

@Component({
    selector: 'dhpp-reference-list',
    templateUrl: './reference-list.component.html',
    styleUrls: ['reference-list.component.scss']
})
export class TextListComponent extends BaseIndexListDirective<TextPassageQueryParameterI, TextPassageFilterI, TextPassageOptionsI, TextPassage> {

  filters: any[] = [{ id: 1, name: 'erster filter'}];
  labelTextSearch = 'Lemma';
  labelPosSearch = 'Wortart';
  labelConceptSearch = 'Begriffe';

  tokenFilter?: TokenFilterI;

  constructor(
        public router: Router,
        public route: ActivatedRoute,
        public locationService: Location,
        public http: HttpClient,
        public service: TextPassageService, // --> service
        public history: HistoryService<TextPassageQueryParameterI, TextPassageFilterI, TextPassageOptionsI, TextPassage>,

    ) {
        super(router, route, locationService, http, service, history)
    }

    ////////////////////
    // Requests
    ////////////////////

  public addFilter() {
    this.filters.push({ id: 2, name: 'zweiter filter' });
  }
    public first() {
        if (!this.isLoading) {
            this.isLoading = true;
            this.qp.offset = 0
            this.instances = []

            this.service.getInstances(this.qp)
                .then(data => {
                    this.isLoading = false;
                    this.he.resetInstances()
                    this.he.initNewInstances(data, this.instances.length) //Fehler? wg Count?
                    this.instances = data
                    console.warn(this.instances)
                })
                .catch(error => {
                    this.isLoading = false;
                    console.warn(error)
                })
        }
    }

    public next() {
        if (!this.isLoadingNext) {
            this.isLoadingNext = true;
            this.qp.offset = this.qp.offset + this.qp.limit;
            this.service.getInstances(this.qp)
                .then(data => {
                    this.isLoadingNext = false;
                    this.he.addInstances(data)
                    this.instances = this.he.getInstances()
                })
                .catch(error => {
                    this.isLoadingNext = false;
                    console.warn(error)
                })
        }
    }

    onScrollDown() {
        this.next()
    }

    ////////////////////
    // Lifecycle
    ////////////////////

    ngOnInit() {
        this.historyService.initListHistoryEntry(this.routeString, this.service)
            .then(he => {
                this.he = he
                let hasLoadedInstances = he.getQueryCalled()
                this.subscription = he.qp
                    .subscribe(
                        qp => {
                            this.qp = qp
                            if (!hasLoadedInstances) {
                                this.first()
                            } else {
                                this.instances = he.getInstances()
                                hasLoadedInstances = false
                            }
                        }
                    )
            })
    }
}
