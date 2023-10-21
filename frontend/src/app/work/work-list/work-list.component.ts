/* eslint-disable no-console */
import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HistoryService } from '../../shared/historyService';
import { WorkClass } from '../work.class';
import { WorkFilterI, WorkOptionsI, WorkQueryParameterI, WorkService } from '../work.service';
import { BaseIndexListDirective } from "app/shared/baseIndexComponent/list/list.component";
import { Store, select } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { selectAuthors, selectFilterClassExtended } from 'app/store/general-filter.reducer';
import { takeUntil } from 'rxjs/operators';
import { generalFilterReducer } from '../../store/general-filter.reducer';
import { stat } from 'fs';
import { reset } from 'app/store/general-filter.actions';

@Component({
    selector: 'dhpp-work-list',
    templateUrl: './work-list.component.html',
    styleUrls: ['work-list.component.scss']
})
export class WorkListComponent extends BaseIndexListDirective<WorkQueryParameterI, WorkFilterI, WorkOptionsI, WorkClass> implements OnInit, OnDestroy {

    // Form
    //// Label
    labelTextSearch = 'Titel'
    private ngUnsubscribe = new Subject<void>();

    generalFilter$: Observable<any>;
    generalFilter: any;

    constructor(
        // BaseIndexComponent
        public router: Router,
        public route: ActivatedRoute,
        public locationService: Location,
        public http: HttpClient,
        public service: WorkService, // --> service
        public history: HistoryService<WorkQueryParameterI, WorkFilterI, WorkOptionsI, WorkClass>,
        public store: Store
        // Individual
    ) {
        super(router, route, locationService, http, service, history);

        this.store.pipe(select(state => state)).subscribe(state => {
            // console.log(state);
            // this.qp.filter.isAuthorIdsActive = state["generalFilter"].isAuthorActive;
            if (state["generalFilter"].authors && state["generalFilter"].authors.length > 0) {
                this.qp.filter.isAuthorIdsActive = true;
                this.qp.filter.authorIds = state["generalFilter"].authors
            } 
            // console.log(this.qp);
        }
        );

    }

    ngOnInit(): void {
        super.ngOnInit();

    }

    reset() {
        this.store.dispatch(reset());
        this.isLoading = false;
        this.qp.filter.isAuthorIdsActive = false;
        this.qp.filter.authorIds = [];
        this.search();
    }

    search() {
        super.first();

    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

}
