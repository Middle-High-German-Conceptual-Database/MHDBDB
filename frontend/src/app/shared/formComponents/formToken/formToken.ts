import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, ElementRef, Inject, Injectable, Input, OnDestroy, OnInit, Optional, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith, takeUntil, throttleTime } from 'rxjs/operators';
import { Concept } from '../../../concept/concept.class';
import { ConceptService } from '../../../concept/concept.service';
import { TextPassage } from '../../../text/text.class';
import {
  TokenFilterI,
  TextPassageFilterI,
  TextPassageOptionsI,
  TextPassageQueryParameterI,
  TextPassageService,
  defaultTokenFilter
} from '../../../text/textPassage.service';
import { TextService } from '../../../text/text.service';
import { ListHistoryEntry } from '../../history.class';
import { HistoryService } from '../../historyService';
import { PoS } from '../../pos/pos.class';
import { PosService } from '../../pos/pos.service';
import { Store, select } from '@ngrx/store';
import { selectTokenFilterById } from 'app/store/filter.reducer';
import { updateFilterById } from 'app/store/filter.actions';
import { OnomasticsService } from 'app/onomastics/onomastics.service';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import {SkosConceptI} from "app/shared/baseIndexComponent/baseindexcomponent.class";

@Injectable({ providedIn: 'root' })
export class tokenFormService {
  private _qpSubject: BehaviorSubject<TextPassageQueryParameterI>;
  public qp: TextPassageQueryParameterI;

  public nextQp() {
    this._qpSubject.next(this.qp);
  }

  public qpObservable: Observable<TextPassageQueryParameterI>;

  constructor(public textPassageService: TextPassageService) {
    this.qp = this.textPassageService.defaultQp;
    this._qpSubject = new BehaviorSubject(this.qp);
    this.qpObservable = this._qpSubject.asObservable();
  }
}

@Component({
  selector: 'dhpp-form-token',
  templateUrl: './formToken.html',
  styleUrls: ['./formToken.scss']
})
export class FormTokenComponent implements OnInit, OnDestroy {
  @Input() routeString: string;
  @Input() tokenFilter;
  @Input() filter: any;
  advancedSearch = false;
  isNamenActive = false;
  public he: ListHistoryEntry<TextPassageQueryParameterI, TextPassageFilterI, TextPassageOptionsI, TextPassage>;
  isLoading: boolean = false;
  notifier = new Subject();
  private subscriptionQueryHistory: Subscription;
  private subscriptionTokenFormQp: Subscription;
  qp: TextPassageQueryParameterI;

  private destroy$ = new Subject<void>();

  // chips input for concepts
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  selectable = true;
  removable = true;
  addOnBlur = true;
  visible = true;

  public onomasticForm: FormGroup;

  onomasticCtrl = new FormControl();
  filteredOnomastics: Observable<string[]>;
  public onomasticsList: Concept[];
  public filterOnomastics: FormGroup;
  public onomasticsLabels: string[] = [];
  @ViewChild('onomasticInput', { static: false }) onomasticInput: ElementRef<HTMLInputElement>;

  constructor(
    public historyService: HistoryService<TextPassageQueryParameterI, TextPassageFilterI, TextPassageOptionsI, TextPassage>,
    public help: MatDialog,
    public TextPassageService: TextPassageService,
    public service: tokenFormService,
    public store: Store,
    public conceptService: OnomasticsService
  ) { }

  openHelp() {
    const dialogRef = this.help.open(FormTokenHelpComponent);
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  private subscribeQueryHistory(): Subscription {
    return this.he.qp.pipe(distinctUntilChanged()).subscribe(value => {
      this.isLoading = true;
      this.service.qp = this.he.getQp();
      this.isLoading = false;
    });
  }

  private subscribeTokenFormQp(): Subscription {
    return this.service.qpObservable.subscribe(value => {
      let newQp: TextPassageQueryParameterI = this.he.getQp();
      newQp.filter.tokenFilters = JSON.parse(JSON.stringify(value.filter.tokenFilters));
      this.he.setQp(newQp);
    });
  }

  get onomastics() {
    return <FormGroup>this.onomasticForm.get('filterOnomastics');
  }

  removeOnomastic(conceptLabel: string): void {
    this.onomastics.removeControl(conceptLabel);
    this.onomastics.updateValueAndValidity();
  }

  selectedOnomastic(event: MatAutocompleteSelectedEvent): void {
    this.onomastics.addControl(event.option.viewValue, new FormControl(true));
    this.onomasticInput.nativeElement.value = '';
    this.onomasticCtrl.setValue(null);
  }

  addForm() {
    this.service.qp.filter.tokenFilters.push(defaultTokenFilter);
    this.service.nextQp();
  }

  delForm(index: number) {
    this.service.qp.filter.tokenFilters.splice(index, 1);
    this.service.nextQp();
  }

  upForm(index: number) {
    this.moveForm(-1, index);
  }

  setAdvChecked(e: MatSlideToggleChange) {
    this.advancedSearch = e.checked;

    const updatedFilter = { ...this.tokenFilter, advancedSearch: e.checked };
    this.store.dispatch(updateFilterById({ filterId: this.filter.id, newFilter: updatedFilter }));
  }

  setNamenChecked(e: MatSlideToggleChange) {
    this.isNamenActive = e.checked;

    const updatedFilter = { ...this.tokenFilter, isNamenActive: e.checked };
    this.store.dispatch(updateFilterById({ filterId: this.filter.id, newFilter: updatedFilter }));
  }

  moveForm(shift, currentIndex) {
    let newIndex: number = currentIndex + shift;
    if (newIndex === -1) {
      newIndex = this.service.qp.filter.tokenFilters.length - 1;
    } else if (newIndex == this.service.qp.filter.tokenFilters.length) {
      newIndex = 0;
    }

    const current = this.service.qp.filter.tokenFilters[currentIndex];
    this.delForm(currentIndex);
    this.service.qp.filter.tokenFilters.splice(newIndex, 0, current);
    this.service.nextQp();
  }

  downForm(index: number) {
    this.moveForm(1, index);
  }

  private _filterOnomastic(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.onomasticsLabels.filter(concept => concept.toLowerCase().indexOf(filterValue) >= 0);
  }

  ngOnInit() {
    this.tokenFilter = { ...this.tokenFilter } as TokenFilterI;

    this.filterOnomastics = new FormGroup({});
    this.onomasticForm = new FormGroup({
      filterOnomastics: this.filterOnomastics
    });

    this.updateOnomastics();

    this.filteredOnomastics = this.onomasticCtrl.valueChanges.pipe(
        startWith(null),
        map((concept: string | null) => (concept ? this._filterOnomastic(concept) : this.onomasticsLabels.slice()))
    );

    this.store
      .pipe(
        select(selectTokenFilterById, { id: this.filter.id }),
        takeUntil(this.destroy$)
      )
      .subscribe(tokenFilter => {
        this.advancedSearch = tokenFilter.advancedSearch;
        this.isNamenActive = tokenFilter.isNamenActive;
        this.tokenFilter.onomastics = tokenFilter.onomastics;

        this.onomasticForm.disable({ emitEvent: false }); // disable form to prevent emitting events while patching values
        this.updateOnomastics();
        this.onomasticForm.enable({ emitEvent: false }); // re-enable form after patching values

      });

    let tempOnomastics = [];

    this.onomasticForm.valueChanges.pipe(distinctUntilChanged()).subscribe(value => {
      for (let v in value.filterOnomastics) {
        const e = this.onomasticsList.find(element => element.label === v);
        if (e != undefined) {
          tempOnomastics.push(e.id);
        }
      }

      const updatedFilter = {...this.tokenFilter, onomastics: tempOnomastics};
      this.tokenFilter = updatedFilter;
        this.store.dispatch(updateFilterById({filterId: this.filter.id, newFilter: updatedFilter}));
    });

    /*this.historyService.history.pipe(takeUntil(this.notifier)).subscribe(historyMap => {
      this.he = this.historyService.getListHistoryEntry(this.routeString);
      if (this.he) {
        this.service.qp = this.he.getQp();
        this.subscriptionQueryHistory = this.subscribeQueryHistory();
        this.subscriptionTokenFormQp = this.subscribeTokenFormQp();
        this.notifier.complete();
      }
    });*/
  }


  updateOnomastics() {
    if (this.onomasticsList && this.onomasticsList.length == 0) {
      this.conceptService.getRealAllConcepts().then(data => {
        this.onomasticsList = data;
        // @todo add redux

        this.onomasticsList.forEach(concept => {
          this.onomasticsLabels.push(concept.label);
          // concept.altLabels?.map(label => this.conceptLabels.push(label));
          if (this.tokenFilter.onomastics.includes(concept.id)) {
            this.onomastics.addControl(concept.label.trim(), new FormControl(true));
          }
        });
        //   this.subscription = this.subscribe();
      });
    }
  }

  ngOnDestroy(): void {
    /*if (this.subscriptionQueryHistory) {
      this.subscriptionQueryHistory.unsubscribe();
    }

    if (this.subscriptionTokenFormQp) {
      this.subscriptionTokenFormQp.unsubscribe();
    }*/
  }
}

@Component({
  selector: 'dhpp-form-token-help',
  templateUrl: './formTokenHelp.html'
})
export class FormTokenHelpComponent { }

@Component({
  selector: 'dhpp-form-token-word',
  templateUrl: './formTokenWord.html'
})
export class FormTokenWordComponent {
  @Input() tokenFilter;
  @Input() filter: any;
  @ViewChild('myInput') myInput: ElementRef;

  // @Output() labelValue = new EventEmitter<string>();
  form: FormGroup;

  private destroy$ = new Subject<void>();

  constructor(public service: tokenFormService, public store: Store) { }

  ngOnInit() {
    this.tokenFilter = { ...this.tokenFilter } as TokenFilterI;

    this.form = new FormGroup({
      label: new FormControl(this.tokenFilter.label),
      searchLabelInLemma: new FormControl(this.tokenFilter.searchLabelInLemma),
      searchExactForm: new FormControl(this.tokenFilter.searchExactForm)
    });

   this.store
    .pipe(
      select(selectTokenFilterById, { id: this.filter.id }),
      takeUntil(this.destroy$)
    )
    .subscribe(tokenFilter => {
      if (JSON.stringify(tokenFilter) !== JSON.stringify(this.form.value)) {
        this.form.patchValue(tokenFilter, { emitEvent: false });
        // this.focusOnInput();

      }
    }); 
    
    this.form.valueChanges
      .pipe(
        distinctUntilChanged(),
        debounceTime(2000),
        takeUntil(this.destroy$)
      )
      .subscribe(value => {
        const changes =
          this.tokenFilter.label !== value.label || this.tokenFilter.searchExactForm !== value.searchExactForm || this.tokenFilter.searchLabelInLemma !== value.searchLabelInLemma;
        if (changes) {
          const updatedFilter = { ...this.tokenFilter, ...value };
          this.store.dispatch(updateFilterById({ filterId: this.filter.id, newFilter: updatedFilter }));
          this.service.nextQp();
        }
      }); 
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

/*  focusOnInput(): void {
    this.myInput.nativeElement.focus();
}*/

}

@Component({
  selector: 'dhpp-form-token-pos',
  templateUrl: './formTokenPos.html'
})
export class FormTokenPosComponent implements OnInit, OnDestroy {
  @Input() tokenFilter;
  @Input() filter: any;

  public posList: PoS[];
  public form: FormGroup;
  public pos: string[];

  private tokenFilterSubscription$: Subscription;
  private formValueChangesSubscription$: Subscription;
  private destroy$ = new Subject<void>();

  constructor(public service: tokenFormService, public posService: PosService, public store: Store) { }

  ngOnInit() {
    this.tokenFilter = { ...this.tokenFilter } as TokenFilterI;
    this.form = new FormGroup({});

    this.posService.getTopConcepts().then(data => {
      this.posList = data as PoS[];
      this.posList.forEach(pos => {
        if (pos.label === 'Substantiv') pos.label = 'Nomen';
        this.form.addControl(pos.label, new FormControl(this.tokenFilter.pos.includes(pos.id)));
      });

      this.tokenFilterSubscription$ = this.store
        .pipe(
          select(selectTokenFilterById, { id: this.filter.id }),
          takeUntil(this.destroy$)
        )
        .subscribe(tokenFilter => {
          this.form.disable({ emitEvent: false }); // disable form to prevent emitting events while patching values
          this.posList.forEach(pos => {
            this.form.controls[pos.label].patchValue(tokenFilter.pos.includes(pos.id), { emitEvent: false });
          });
          this.form.enable({ emitEvent: false }); // re-enable form after patching values
        });

      this.formValueChangesSubscription$ = this.form.valueChanges
        .pipe(
          distinctUntilChanged(),
          takeUntil(this.destroy$)
        )
        .subscribe(value => {
          const posList$ = this.posList.filter(pos => value[pos.label]).map(pos => pos.id);

          if (posList$.length != this.tokenFilter.pos.length || !posList$.every((v, i) => v === this.tokenFilter.pos[i])) {
            const updatedFilter = { ...this.tokenFilter, pos: posList$ };
            this.store.dispatch(updateFilterById({ filterId: this.filter.id, newFilter: updatedFilter }));
            this.service.nextQp();
          }
        });
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

@Component({
  selector: 'dhpp-form-token-concepts',
  templateUrl: './formTokenConcepts.html'
})
export class FormTokenConceptsComponent implements OnInit, OnDestroy {
  @Input() tokenFilter;
  @Input() filter: any;

  public conceptList: SkosConceptI[];
  public form: FormGroup;
  public filterConcepts: FormGroup;
  public conceptLabels: string[] = [];
  private subscription: Subscription;

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

  constructor(public service: tokenFormService, public conceptService: ConceptService, public store: Store) {
    this.filteredConcepts = this.conceptCtrl.valueChanges.pipe(
      startWith(null),
      map((concept: string | null) => (concept ? this._filterConcept(concept) : this.conceptLabels.slice()))
    );
  }

  private _filterConcept(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.conceptLabels.filter(concept => concept.toLowerCase().indexOf(filterValue) >= 0);
  }

  get concepts() {
    return <FormGroup>this.form.get('filterConcepts');
  }

  removeConcept(conceptLabel: string): void {
    this.concepts.removeControl(conceptLabel);
    this.concepts.updateValueAndValidity();
  }

  selectedConcept(event: MatAutocompleteSelectedEvent): void {
    this.concepts.addControl(event.option.viewValue, new FormControl(true));
    this.conceptInput.nativeElement.value = '';
    this.conceptCtrl.setValue(null);
  }

  initHtmlForm() {
    this.filterConcepts = new FormGroup({});
    this.form = new FormGroup({
      filterConcepts: this.filterConcepts
    });


  }

  private subscribe(): Subscription {
    console.log(this.tokenFilter);
    this.tokenFilter = { ...this.tokenFilter } as TokenFilterI;

    return this.form.valueChanges.pipe(distinctUntilChanged()).subscribe(value => {
      console.log(value);
      this.tokenFilter.concepts = [];
      for (let v in value.filterConcepts) {
        console.log(v);
        const e = this.conceptList.find(element => element.label === v);
        if (e != undefined) {
          console.log(e);
          this.tokenFilter.concepts.push(e.id);
        }
      }
      const updatedFilter = { ...this.tokenFilter };
      console.log(updatedFilter);
      this.store.dispatch(updateFilterById({ filterId: this.filter.id, newFilter: updatedFilter }));
      this.service.nextQp();
    });
  }

  ngOnInit() {
    this.initHtmlForm();
    this.conceptService.getRealAllConcepts().then(data => {
      this.conceptList = data;
      // @todo add redux

      this.conceptList.forEach(concept => {
        this.conceptLabels.push(concept.label);
        // concept.altLabels?.map(label => this.conceptLabels.push(label));

        if (this.tokenFilter.concepts.includes(concept.id)) {
          this.concepts.addControl(concept.label.trim(), new FormControl(true));
        }
      });
      this.subscription = this.subscribe();
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}

@Component({
  selector: 'dhpp-form-token-namen',
  templateUrl: './formTokenNamen.html'
})
export class FormTokenNamenComponent implements OnInit, OnDestroy {
  @Input() tokenFilter;
  @Input() filter: any;

  public conceptList: Concept[];
  public form: FormGroup;
  public filterOnomastics: FormGroup;
  public conceptLabels: string[] = [];
  private subscription: Subscription;

  // chips input for concepts
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  selectable = true;
  removable = true;
  addOnBlur = true;
  visible = true;

  // autocomplete concepts
  onomasticCtrl = new FormControl();
  filteredOnomastics: Observable<string[]>;

  @ViewChild('onomasticInput', { static: false }) conceptInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto', { static: false }) matAutocomplete: MatAutocomplete;

  constructor(public service: tokenFormService, public conceptService: OnomasticsService, public store: Store) {

  }

  private _filterConcept(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.conceptLabels.filter(concept => concept.toLowerCase().indexOf(filterValue) >= 0);
  }

  get onomastics() {
    return <FormGroup>this.form.get('filterOnomastics');
  }

  removeOnomastic(conceptLabel: string): void {
    this.onomastics.removeControl(conceptLabel);
    this.onomastics.updateValueAndValidity();
  }

  selectedOnomastic(event: MatAutocompleteSelectedEvent): void {
    this.onomastics.addControl(event.option.viewValue, new FormControl(true));
    this.conceptInput.nativeElement.value = '';
    this.onomasticCtrl.setValue(null);
  }

  ngOnInit() {
    this.tokenFilter = { ...this.tokenFilter } as TokenFilterI;

    this.filterOnomastics = new FormGroup({});
    this.form = new FormGroup({
      isNamenActive: new FormControl(this.tokenFilter.isNamenActive),
      filterOnomastics: this.filterOnomastics
    });

    this.conceptService.getRealAllConcepts().then(data => {
      this.conceptList = data;
      // @todo add redux

      this.conceptList.forEach(concept => {
        this.conceptLabels.push(concept.label);
        // concept.altLabels?.map(label => this.conceptLabels.push(label));
        if (this.tokenFilter.onomastics.includes(concept.id)) {
          this.onomastics.addControl(concept.label.trim(), new FormControl(true));
        }
      });
   //   this.subscription = this.subscribe();
    });

    this.filteredOnomastics = this.onomasticCtrl.valueChanges.pipe(
        startWith(null),
        map((concept: string | null) => (concept ? this._filterConcept(concept) : this.conceptLabels.slice()))
    );


    this.form.valueChanges.pipe(distinctUntilChanged()).subscribe(value => {
      console.log(value);
      this.tokenFilter.onomastics = [];

      const changes =
          this.tokenFilter.isNamenActive !== value.isNamenActive ||
          this.tokenFilter.onomastics !== value.onomastics;

      for (let v in value.filterConcepts) {
        const e = this.conceptList.find(element => element.label === v);
        if (e != undefined) {
          this.tokenFilter.onomastics.push(e.id);
        }
      }

      if (changes) {
        const updatedFilter = {...this.tokenFilter};
        this.store.dispatch(updateFilterById({filterId: this.filter.id, newFilter: updatedFilter}));
        this.service.nextQp();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
   //   this.subscription.unsubscribe();
    }
  }
}


@Component({
  selector: 'dhpp-form-token-position',
  templateUrl: './formTokenPosition.html'
})
export class FormTokenPositionComponent implements OnInit, OnDestroy {
  @Input() tokenFilter;
  @Input() filter: any;

  form: FormGroup;
  private destroy$ = new Subject<void>();

  versList = ['Verse'];
  anfangList = ['Anfang', 'Ende'];

  constructor(public service: tokenFormService, public store: Store) { }

  ngOnInit() {
    this.tokenFilter = { ...this.tokenFilter } as TokenFilterI;

    this.form = new FormGroup({
      isPositionActive: new FormControl(this.tokenFilter.isPositionActive),
      vers: new FormControl(this.tokenFilter.vers),
      anfang: new FormControl(this.tokenFilter.anfang)
    });

    this.store
      .pipe(
        select(selectTokenFilterById, { id: this.filter.id }),
        takeUntil(this.destroy$)
      )
      .subscribe(tokenFilter => {
        this.form.disable({ emitEvent: false }); // disable form to prevent emitting events while patching values
        this.form.patchValue(tokenFilter, { emitEvent: false });
        this.form.enable({ emitEvent: false }); // re-enable form after patching values
      });

    this.form.valueChanges
      .pipe(
        debounceTime(2000),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(value => {
        const changes =
          this.tokenFilter.isPositionActive !== value.isPositionActive ||
          this.tokenFilter.vers !== value.vers ||
          this.tokenFilter.anfang !== value.anfang;
        if (changes) {
          const updatedFilter = { ...this.tokenFilter, ...value };
          this.store.dispatch(updateFilterById({ filterId: this.filter.id, newFilter: updatedFilter }));
          this.service.nextQp();
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}