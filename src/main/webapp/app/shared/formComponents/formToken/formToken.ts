import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, ElementRef, Inject, Injectable, Input, OnDestroy, OnInit, Optional, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
import { distinctUntilChanged, map, startWith, takeUntil } from 'rxjs/operators';
import { Concept } from '../../../concept/concept.class';
import { ConceptService } from '../../../concept/concept.service';
import { TextPassage } from '../../../text/text.class';
import { TokenFilterI, TextPassageFilterI, TextPassageOptionsI, TextPassageQueryParameterI, TextPassageService, defaultTokenFilter } from '../../../text/textPassage.service';
import { TextService } from '../../../text/text.service';
import { ListHistoryEntry } from '../../history.class';
import { HistoryService } from '../../historyService';
import { PoS } from '../../pos/pos.class';
import { PosService } from '../../pos/pos.service';

@Injectable({ providedIn: 'root' })
export class tokenFormService {
    private _qpSubject: BehaviorSubject<TextPassageQueryParameterI>
    public qp: TextPassageQueryParameterI

    public nextQp() {
        this._qpSubject.next(this.qp)
    }

    public qpObservable: Observable<TextPassageQueryParameterI>

    constructor(
        public textPassageService: TextPassageService
    ) {
        this.qp = this.textPassageService.defaultQp
        this._qpSubject = new BehaviorSubject(this.qp)
        this.qpObservable = this._qpSubject.asObservable()
    }
}

@Component({
    selector: 'dhpp-form-token',
    templateUrl: './formToken.html',
    styleUrls: ['./formToken.scss']
})
export class FormTokenComponent implements OnInit, OnDestroy {
    @Input() routeString: string;
    public he: ListHistoryEntry<TextPassageQueryParameterI, TextPassageFilterI, TextPassageOptionsI, TextPassage>
    isLoading: boolean = false
    notifier = new Subject()
    private subscriptionQueryHistory: Subscription;
    private subscriptionTokenFormQp: Subscription;
    qp: TextPassageQueryParameterI
    constructor(
        public historyService: HistoryService<TextPassageQueryParameterI, TextPassageFilterI, TextPassageOptionsI, TextPassage>,
        public help: MatDialog,
        public TextPassageService: TextPassageService,
        public service: tokenFormService,
    ) {

    }

    openHelp() {
        const dialogRef = this.help.open(FormTokenHelpComponent);
        dialogRef.afterClosed().subscribe(result => {
            console.log(`Dialog result: ${result}`);
        });
    }

    private subscribeQueryHistory(): Subscription {
        return this.he.qp
            .pipe(
                distinctUntilChanged()
            )
            .subscribe(value => {
                this.isLoading = true
                this.service.qp = this.he.getQp()
                this.isLoading = false
            })
    }

    private subscribeTokenFormQp(): Subscription {
        return this.service.qpObservable
            .subscribe(value => {
                let newQp: TextPassageQueryParameterI= this.he.getQp()
                newQp.filter.tokenFilters = JSON.parse(JSON.stringify(value.filter.tokenFilters))
                this.he.setQp(newQp)
            })
    }

    addForm() {
        this.service.qp.filter.tokenFilters.push(defaultTokenFilter)
        this.service.nextQp()
    }

    delForm(index: number) {
        this.service.qp.filter.tokenFilters.splice(index, 1);
        this.service.nextQp()
    }

    upForm(index: number) {
        this.moveForm(-1, index)
    }

    moveForm(shift, currentIndex) {
        let newIndex: number = currentIndex + shift;
        if (newIndex === -1) {
            newIndex = this.service.qp.filter.tokenFilters.length - 1;
        } else if (newIndex == this.service.qp.filter.tokenFilters.length) {
            newIndex = 0;
        }

        const current = this.service.qp.filter.tokenFilters[currentIndex]
        this.delForm(currentIndex)
        this.service.qp.filter.tokenFilters.splice(newIndex, 0, current)
        this.service.nextQp()
    }

    downForm(index: number) {
        this.moveForm(1, index)
    }

    ngOnInit() {
        this.historyService.history
            .pipe(takeUntil(this.notifier))
            .subscribe(
                historyMap => {
                    this.he = this.historyService.getListHistoryEntry(this.routeString)
                    if (this.he) {
                        this.service.qp = this.he.getQp()
                        this.subscriptionQueryHistory = this.subscribeQueryHistory()
                        this.subscriptionTokenFormQp = this.subscribeTokenFormQp()
                        this.notifier.complete()
                    }
                }
            )
    }

    ngOnDestroy(): void {
        if (this.subscriptionQueryHistory) {
          this.subscriptionQueryHistory.unsubscribe()
        }

        if (this.subscriptionTokenFormQp) {
          this.subscriptionTokenFormQp.unsubscribe()
        }
    }
}

@Component({
    selector: 'dhpp-form-token-help',
    templateUrl: './formTokenHelp.html',
})
export class FormTokenHelpComponent { }


@Component({
    selector: 'dhpp-form-token-word',
    templateUrl: './formTokenWord.html',
})
export class FormTokenWordComponent {
    @Input() tokenFilter
    form: FormGroup

    constructor(
        public service: tokenFormService,
    ) {

    }


    ngOnInit() {
        this.tokenFilter = this.tokenFilter as TokenFilterI
        this.form = new FormGroup({
            label: new FormControl(this.tokenFilter.label),
            searchLabelinLemma: new FormControl(this.tokenFilter.searchLabelinLemma),
        });
        this.form
            .valueChanges
            .pipe(
                distinctUntilChanged()
            )
            .subscribe(
                value => {
                    let changes: boolean = false
                    if (this.tokenFilter.label != value.label) {
                        this.tokenFilter.label = value.label
                        changes = true
                    }
                    if (this.tokenFilter.searchLabelinLemma != value.searchLabelinLemma) {
                        this.tokenFilter.searchLabelinLemma = value.searchLabelinLemma
                        changes = true
                    }
                    if (changes) {
                        this.service.nextQp()
                    }
                }
            )
    }
}

@Component({
    selector: 'dhpp-form-token-pos',
    templateUrl: './formTokenPos.html',
})
export class FormTokenPosComponent implements OnInit, OnDestroy {
    @Input() tokenFilter
    public posList: PoS[]
    public form: FormGroup
    private subscription: Subscription

    constructor(
        public service: tokenFormService,
        public posService: PosService,
    ) {

    }

    private subscribe(): Subscription {
        return this.form
            .valueChanges
            .pipe(
                distinctUntilChanged()
            )
            .subscribe(
                value => {
                    let changed: boolean = false
                    let posList$: string[] = []
                    for (let label in value) {
                        const e = this.posList.find(element => element.label == label)
                        if (value[label] == true) {
                            posList$.push(e.id)
                        }
                    }
                    if (posList$.length != this.tokenFilter.pos.length || !(posList$.every((v, i) => v === this.tokenFilter.pos[i]))) {
                        this.tokenFilter.pos = posList$.slice()
                        changed = true
                    }
                    if (changed) {
                        this.service.nextQp()
                    }
                }
            )
    }

    ngOnInit() {
        this.posService.getTopConcepts().then(
            data => {
                this.posList = data as PoS[]
                this.tokenFilter = this.tokenFilter as TokenFilterI
                this.form = new FormGroup({});
                this.posList.forEach(
                    pos => {
                        if (this.tokenFilter.pos.includes(pos.id)) {
                            this.form.addControl(pos.label, new FormControl(true))
                        } else {
                            this.form.addControl(pos.label, new FormControl(false))
                        }
                    }
                )
                this.subscription = this.subscribe()
            })
    }

    ngOnDestroy(): void {
        if (this.subscription) {
          this.subscription.unsubscribe()
        }
    }
}


@Component({
    selector: 'dhpp-form-token-concepts',
    templateUrl: './formTokenConcepts.html',
})
export class FormTokenConceptsComponent implements OnInit, OnDestroy {
    @Input() tokenFilter
    public conceptList: Concept[]
    public form: FormGroup
    public filterConcepts: FormGroup
    public conceptLabels: string[] = []
    private subscription: Subscription

    // chips input for concepts
    readonly separatorKeysCodes: number[] = [ENTER, COMMA];
    selectable = true;
    removable = true;
    addOnBlur = true;
    visible = true;

    // autocomplete concepts
    conceptCtrl = new FormControl();
    filteredConcepts: Observable<string[]>;

    @ViewChild('conceptInput', { static: false }) conceptInput: ElementRef<HTMLInputElement>;
    @ViewChild('auto', { static: false }) matAutocomplete: MatAutocomplete;

    constructor(
        public service: tokenFormService,
        public conceptService: ConceptService,
    ) {
        this.filteredConcepts = this.conceptCtrl.valueChanges.pipe(
            startWith(null),
            map((concept: string | null) => concept ? this._filterConcept(concept) : this.conceptLabels.slice()));
    }

    private _filterConcept(value: string): string[] {
        const filterValue = value.toLowerCase();
        return this.conceptLabels.filter(concept => concept.toLowerCase().indexOf(filterValue) === 0);
    }

    get concepts() {
        return <FormGroup>this.form.get('filterConcepts')
    }

    removeConcept(conceptLabel: string): void {
        this.concepts.removeControl(conceptLabel);
        this.concepts.updateValueAndValidity();
    }

    selectedConcept(event: MatAutocompleteSelectedEvent): void {
        this.concepts.addControl(event.option.viewValue, new FormControl(true))
        this.conceptInput.nativeElement.value = '';
        this.conceptCtrl.setValue(null);
    }

    initHtmlForm() {
        this.filterConcepts = new FormGroup({});
        this.form = new FormGroup({
            filterConcepts: this.filterConcepts
        });

        this.conceptList.forEach((concept) => {
            this.conceptLabels.push(concept.label)
            if (this.tokenFilter.concepts.includes(concept.id)) {
                this.concepts.addControl(concept.label.trim(), new FormControl(true))
            }
        })
    }

    private subscribe(): Subscription {
        return this.form
            .valueChanges
            .pipe(
                distinctUntilChanged()
            )
            .subscribe(
                value => {
                    this.tokenFilter.concepts = []
                    for (let v in value.filterConcepts) {
                        const e = this.conceptList.find(element => element.label === v)
                        this.tokenFilter.concepts.push(e.id)
                    }
                    this.service.nextQp()
                }
            )
    }

    ngOnInit() {
        this.conceptService.getAllConcepts().then(
            data => {
                this.conceptList = data
                this.initHtmlForm()
                this.subscription = this.subscribe()
            }
        )
    }

    ngOnDestroy(): void {
      if (this.subscription) {
        this.subscription.unsubscribe()
      }
    }
}
