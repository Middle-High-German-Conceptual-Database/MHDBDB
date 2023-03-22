import { Directive, Input, OnDestroy, OnInit } from "@angular/core";
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subject, Subscription } from "rxjs";
import { distinctUntilChanged, takeUntil } from "rxjs/operators";
import { ListHistoryEntry } from '../history.class';
import { HistoryService } from "../historyService";
import { FilterIdI, FilterI, OptionsI, QueryParameterI } from './../mhdbdb-graph.service';

@Directive()
export abstract class FormDirective<qT extends QueryParameterI<f, o>, f extends FilterI, o extends OptionsI, instanceClass> implements OnInit, OnDestroy {
    @Input() label?: string;
    @Input() routeString: string;

    protected subscriptionQuery: Subscription;
    protected subscriptionForm: Subscription;
    qp: qT;
    public form: FormGroup;
    public he: ListHistoryEntry<qT, f, o, instanceClass>
    notifier = new Subject()
    protected isLoading:boolean = false

    constructor(
        public historyService: HistoryService<qT, f, o, instanceClass>,
        public help: MatDialog,
    ) {
    }

    subscribeForm(): Subscription {
        return this.form
            .valueChanges
            .pipe(
                distinctUntilChanged()
            )
            .subscribe(
                value => {
                    if (!this.isLoading) {
                        this.qp = this.he.getQp()
                        if (this.onValueChanges(value)) {
                            this.he.setQp(this.qp)
                        }
                    }
                },
                error => { console.warn(error) }
            )
    }

    subscribeQueryHistory(): Subscription {
        return this.he.qp
            .pipe(
                distinctUntilChanged()
            )
            .subscribe(value => {
                this.isLoading = true
                this.loadFilter(value.filter)
                this.isLoading = false
        })
    }

    abstract onValueChanges(value):boolean;

    abstract initHtmlForm(filterMap: f);

    abstract loadFilter(filterMap: f);

    abstract openHelp() ;

    ngOnInit() {
        this.historyService.history
            .pipe(takeUntil(this.notifier))
            .subscribe(
                historyMap => {
                    this.he = this.historyService.getListHistoryEntry(this.routeString)
                    if (this.he) {
                        this.qp = this.he.getQp()
                        this.initHtmlForm(this.qp.filter)
                        this.subscriptionQuery = this.subscribeQueryHistory()
                        this.subscriptionForm = this.subscribeForm()
                        this.notifier.complete()
                    }
                }
            )
    }

    ngOnDestroy() {
        if (this.subscriptionForm) {
          this.subscriptionForm.unsubscribe()
        }

        if (this.subscriptionQuery) {
          this.subscriptionQuery.unsubscribe()
        }
    }
}
