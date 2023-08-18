/* eslint-disable no-console */
import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Directive, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ListHistoryEntry } from '../../history.class';
import { HistoryService } from '../../historyService';
import { FilterI, MhdbdbGraphService, OptionsI, QueryParameterI } from '../../mhdbdb-graph.service';
import { MhdbdbEntity } from '../baseindexcomponent.class';

@Directive()
export abstract class BaseIndexListDirective<qT extends QueryParameterI<f, o>, f extends FilterI, o extends OptionsI, c extends MhdbdbEntity> implements OnInit, OnDestroy {

    qp: qT;
    instances: c[] = []
    subscription: Subscription
    routeString = ''
    total:number = 0

    he: ListHistoryEntry<qT, f, o, c>

    // scrolling
    throttle = 300;
    scrollDistance = 1;
    scrollUpDistance = 2;

    // spinner
    isLoading = false;
    isLoadingNext = false

    constructor(
        public router: Router,
        public route: ActivatedRoute,
        public locationService: Location,
        public http: HttpClient,
        public service: MhdbdbGraphService<qT, f, o, c>,
        public historyService: HistoryService<qT, f, o, c>
    ) {
        this.routeString = this.router.url
    }

    ////////////////////
    // Requests
    ////////////////////

    public first() {
        if (!this.isLoading) {
            this.isLoading = true;
            this.qp.offset = 0
            this.instances = []
            this.service.countInstances(this.qp).then(
                data => this.total = data
            ).then(
                res => {
                    this.service.getInstances(this.qp)
                        .then(data => {
                            this.isLoading = false;
                            this.he.resetInstances()
                            this.he.initNewInstances(data, this.total)
                            this.instances = data
                        })
                        .catch(error => {
                            this.isLoading = false;
                            console.warn(error)
                        })
                }
            )
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

    //abstract onValueChanges(value);

    ////////////////////
    // Events
    ////////////////////

    onScrollDown() {
        if (!this.isLoading && this.total > this.qp.offset + this.qp.limit) {
            this.next()
        }
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
                                this.total = he.getTotal()
                                hasLoadedInstances = false
                            }
                        }
                    )
            })
    }

    ngOnDestroy() {
        if (this.subscription) {
          this.subscription.unsubscribe()
        }
    }
}
