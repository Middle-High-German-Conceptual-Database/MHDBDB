import { Component, ElementRef, Injectable, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { HistoryService } from '../../historyService';
import { classFilterT, FilterClassExtendedI, FilterClassI, FilterLabelI, OptionsI, QueryParameterI } from '../../mhdbdb-graph.service';
import { BehaviorSubject, merge, Observable, Subject, Subscription } from 'rxjs';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { debounceTime, distinctUntilChanged, map, startWith, takeUntil } from 'rxjs/operators';
import { WorkService } from 'app/work/work.service';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { SeriesClass, WorkClass } from 'app/work/work.class';
import { FlatTreeControl } from '@angular/cdk/tree';
import { CollectionViewer, DataSource, SelectionChange } from '@angular/cdk/collections';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { Store, select } from '@ngrx/store';
import { defaultFilterClassExtended, selectFilterClassExtended } from 'app/store/general-filter.reducer';
import {
  setLabelActive,
  setSeriesFilterActive,
  setWorksActive,
  updateLabel,
  setAuthorActive,
  updateWorks,
  updateSeries,
  updateAuthors
} from 'app/store/general-filter.actions';
import { Options } from '@angular-slider/ngx-slider';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { PersonQueryParameterI, PersonService } from 'app/indices/person/person.service';
import { Person, PersonClass } from 'app/indices/person/person.class';

@Component({
  selector: 'dhpp-form-filter',
  templateUrl: './formFilter.html',
  styleUrls: ['./formFilter.scss']
})
export class FormFilterComponent<qT extends QueryParameterI<f, o>, f extends FilterClassExtendedI, o extends OptionsI, instanceClass>
  implements OnInit, OnDestroy {
  form: FormGroup;
  private destroy$ = new Subject<void>();

  filterAuthors;
  filterConcepts;
  filterSeries;
  filterWorks;

  filterMap;

  @Input() workFilter = "true";
  
  authorList: PersonClass[] = [];
  workList: WorkClass[] = [];
  seriesList: SeriesClass[] = [];
  seriesChildList: SeriesClass[] = [];
  authorLabels: string[] = [];
  conceptLabels: string[] = [];
  workLabels: string[] = [];
  seriesLabels: string[] = [];
  filterWorksTemp = [];
  filterSeriesTemp = [];
  filterAuthorsTemp = [];

  filterSeriesGroup: any[] = [];

  filterSeriesCheckboxes: FormGroup;
  filterWorksCheckboxes: FormGroup;
  filterAuthorsCheckboxes: FormGroup;

  labelAuthorTimeSearch = 'Lebensdaten AutorIn';

  private filter$: Subscription;

  minValue: number = 900;
  maxValue: number = 1200;
  options: Options = {
    floor: 700,
    ceil: 1600,
    step: 100,
    showTicks: true
  };

  // chips input for concepts
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  selectable = true;
  removable = true;
  addOnBlur = true;
  visible = true;

  workCtrl = new FormControl();
  filteredWorks: Observable<WorkClass[]>;

  authorCtrl = new FormControl();
  filteredAuthors: Observable<PersonClass[]>;

  // autocomplete concepts
  conceptCtrl = new FormControl();
  filteredConcepts: Observable<string[]>;

  advancedSearch = false;

  @ViewChild('conceptInput', { static: false }) conceptInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto', { static: false }) matAutocomplete: MatAutocomplete;

  @ViewChild('workInput', { static: false }) workInput: ElementRef<HTMLInputElement>;
  @ViewChild('authorInput', { static: false }) authorInput: ElementRef<HTMLInputElement>;

  constructor(
    public historyService: HistoryService<qT, f, o, instanceClass>,
    public help: MatDialog,
    public workService: WorkService,
    public personService: PersonService,
    public store: Store
  ) {
    // Autocomplete for concepts field
    this.filteredConcepts = this.conceptCtrl.valueChanges.pipe(
      startWith(null),
      map((concept: string | null) => (concept ? this._filterConcept(concept) : this.conceptLabels.slice()))
    );

    this.filteredWorks = this.workCtrl.valueChanges.pipe(
      startWith(null),
      map((work: string | null) => (work ? this._filterWork(work) : this.workList.slice()))
    );

    this.filteredAuthors = this.authorCtrl.valueChanges.pipe(
      startWith(null),
      map((work: string | null) => (work ? this._filterAuthor(work) : this.authorList.slice()))
    );

  }

  ngOnInit() {
    this.filterMap = { ...defaultFilterClassExtended } as FilterClassExtendedI;

    this.filterSeriesCheckboxes = new FormGroup({});
    this.seriesList.forEach(item => {
      if (this.filterMap && this.filterMap.series && this.filterMap.series.includes(item.id)) {
        this.filterSeriesCheckboxes.addControl(item.label, new FormControl(true));
      } else {
        this.filterSeriesCheckboxes.addControl(item.label, new FormControl(false));
      }
    });

    this.filterWorks = new FormGroup({});
    this.workService.getWorkList().then(data => {
      this.workList = data[0];
      this.workList.forEach(work => {
        this.workLabels.push(`${work.label.trim()} (${work.authorLabel.trim()})`);
        if (this.filterMap && this.filterMap.works && this.filterMap.works.includes(work.id)) {
          // Use work id as control name instead of label
          this.filterWorks.addControl(work.id, new FormControl(true));
        }
      });
    });

    const qp = {
      "order": "label",
      "desc": false,
      "offset": 0,
      "limit": 1000,
      "lang": "de",
      "namedGraphs": "https://dh.plus.ac.at/mhdbdb/namedGraph/mhdbdbMeta",
      "filter": {
          "scheme": "mhdbdbi:nameSystem",
          "topConcepts": true
      },
      "option": {
          "useLucene": false
      }
  } as PersonQueryParameterI; 


    this.filterAuthors = new FormGroup({});
    this.personService.getInstances(qp).then(data => {
      this.authorList = data;
      this.authorList.forEach(work => {
        this.authorLabels.push(`${work.label.trim()}`);
        if (this.filterMap && this.filterMap.authors && this.filterMap.authors.includes(work.id)) {
          // Use work id as control name instead of label
          this.filterAuthors.addControl(work.id, new FormControl(true));
        }
      });
    });

    this.form = new FormGroup({
      label: new FormControl(this.filterMap.label),
      isLabelActive: new FormControl(this.filterMap.isLabelActive),
      isSeriesFilterActive: new FormControl(this.filterMap.isSeriesFilterActive),
      isConceptsActive: new FormControl(this.filterMap.isConceptsActive),
      isWorksActive: new FormControl(this.filterMap.isWorksActive),
      isAuthorActive: new FormControl(this.filterMap.isAuthorActive),
      filterWorks: this.filterWorks,
      filterAuthors: this.filterAuthors,
      series: new FormControl([]),
      filterSeriesCheckboxes: this.filterSeriesCheckboxes
    });

    this.workService.getSeriesParentList().then(data => {
      this.seriesList = data[0];
    });

    this.filter$ = this.store
      .pipe(
        select(selectFilterClassExtended),
        takeUntil(this.destroy$)
      )
      .subscribe(tokenFilter => {
        let modifiedFilter = { ...tokenFilter };
        // iterate over works and series and add label to filter instead of id
        if (tokenFilter.works) {
          modifiedFilter.works = tokenFilter.works.map(id => {
            let work = this.workList.find(work => work.id == id);
            return work ? work.label : '';
          });
        }

        if (tokenFilter.authors) {
          modifiedFilter.authors = tokenFilter.authors.map(id => {
            let work = this.authorList.find(work => work.id == id);
            return work ? work.label : '';
          });
        }

        if (tokenFilter.series) {
          modifiedFilter.series = tokenFilter.series.map(id => {
            let series = this.seriesList.find(series => series.id == id);
            return series ? series.label : '';
          });
        }

        this.form.disable({ emitEvent: false }); // disable form to prevent emitting events while patching values
        this.form.patchValue(modifiedFilter, { emitEvent: false });
        this.form.enable({ emitEvent: false }); // re-enable form after patching values

        this.filterMap = { ...modifiedFilter }; // update filterMap after patching the form
      });

    this.form.valueChanges
      .pipe(
        debounceTime(2000),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(value => {
        if (this.filterMap.isSeriesFilterActive != value.isSeriesFilterActive) {
          this.store.dispatch(setSeriesFilterActive({ isSeriesFilterActive: value.isSeriesFilterActive }));
        }

        if (this.filterMap.isAuthorActive != value.isAuthorActive) {
          this.store.dispatch(setAuthorActive({ isAuthorActive: value.isAuthorActive }));
        }

        if (this.filterMap.isLabelActive != value.isLabelActive) {
          this.store.dispatch(setLabelActive({ isLabelActive: value.isLabelActive }));
        }

        if (this.filterMap.label != value.label) {
          this.store.dispatch(updateLabel({ label: value.label }));
        }

        if (this.filterMap.isWorksActive != value.isWorksActive) {
          this.store.dispatch(setWorksActive({ isWorksActive: value.isWorksActive }));
        }

        const tempFilterWorksArray = Object.keys(value.filterWorks);
        const tempFilterAuthorsArray = Object.keys(value.filterAuthors);

        if (Array.isArray(tempFilterWorksArray) && tempFilterWorksArray.length > 0) {
          this.filterWorksTemp = [];
          tempFilterWorksArray.map(v => {
            // const e = this.workList.find(element => element.label === v);
            this.filterWorksTemp.push(v);
          });
          this.store.dispatch(updateWorks({ works: this.filterWorksTemp }));
        }

        if (Array.isArray(tempFilterAuthorsArray) && tempFilterAuthorsArray.length > 0) {
          this.filterAuthorsTemp = [];
          tempFilterAuthorsArray.map(v => {
            // const e = this.workList.find(element => element.label === v);
            this.filterAuthorsTemp.push(v);
          });
          this.store.dispatch(updateAuthors({ authors: this.filterAuthorsTemp }));
        }

        if (Array.isArray(value.series) && value.series.length > 0) {
          this.filterSeriesTemp = [];
          value.series.map(v => {
            const e = this.seriesList.find(element => element.label === v);
            this.filterSeriesTemp.push(e.id);
          });
          this.store.dispatch(updateSeries({ series: this.filterSeriesTemp }));
          //  this.form.get('series').setValue(this.filterSeriesTemp, { emitEvent: false });
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  setAdvChecked(e: MatSlideToggleChange) {
    this.advancedSearch = e.checked;
  }
  
  private _filterConcept(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.conceptLabels.filter(concept => concept.toLowerCase().includes(filterValue));
  }

  private _filterWork(value: string): WorkClass[] {
    const filterValue = value.toLowerCase();
    return this.workList.filter(work => work.label.toLowerCase().includes(filterValue));
  }

  private _filterAuthor(value: string): PersonClass[] {
    const filterValue = value.toLowerCase();
    return this.authorList.filter(work => work.label.toLowerCase().includes(filterValue));
  }

  get concepts() {
    return <FormGroup>this.form.get('filterConcepts');
  }

  get series() {
    return <FormGroup>this.form.get('filterSeries');
  }

  get works() {
    return <FormGroup>this.form.get('filterWorks');
  }

  get authors() {
    return <FormGroup>this.form.get('filterAuthors');
  }

  reset(): void {
    this.resetAuthors();
    this.resetWorks();
  }

  removeWork(workId: string): void {
    this.works.removeControl(workId);
    this.works.updateValueAndValidity();
  }

  resetWorks(): void {
    const keys = [];
    for(let key in this.works.controls) {
      keys.push(key);
    }
    keys.forEach(k => this.works.removeControl(k));
    this.works.updateValueAndValidity();
  }

  findAuthorById(id: string): string {
    const workItem = this.authorList.find(work => work.id === id);
    return workItem ? `${workItem.label}` : id;
  }

  findLabelById(id: string): string {
    const workItem = this.workList.find(work => work.id === id);
    return workItem ? `${workItem.label} (${workItem.authorLabel})` : id;
  }

  selectedWork(event: MatAutocompleteSelectedEvent): void {
    const work = this.workList.find(w => w.label === event.option.viewValue);
    if (work) {
      this.works.addControl(work.id, new FormControl(true));
      this.workInput.nativeElement.value = '';
      this.workCtrl.setValue(null);
    }
  }

  removeConcept(conceptLabel: string): void {
    this.concepts.removeControl(conceptLabel);
    this.concepts.updateValueAndValidity();
  }

  selectedAuthor(event: MatAutocompleteSelectedEvent): void {
    const work = this.authorList.find(w => w.label === event.option.viewValue);
    if (work) {
      this.authors.addControl(work.id, new FormControl(true));
      this.authorInput.nativeElement.value = '';
      this.authorCtrl.setValue(null);
    }
  }

  removeAuthor(conceptLabel: string): void {
    this.authors.removeControl(conceptLabel);
    this.authors.updateValueAndValidity();
  }

  resetAuthors(): void {
    const keys = [];
    for(let key in this.authors.controls) {
      keys.push(key);
    }
    keys.forEach(k => this.authors.removeControl(k));
    this.authors.updateValueAndValidity();
  }

  selectedConcept(event: MatAutocompleteSelectedEvent): void {
    this.concepts.addControl(event.option.viewValue, new FormControl(true));
    this.conceptInput.nativeElement.value = '';
    this.conceptCtrl.setValue(null);
  }

  handleOnClick(event) {
    this.store.dispatch(updateSeries({ series: event }));
  }

  onSeriesChange(event: MatCheckboxChange, series: SeriesClass) {
    if (event.checked) {
      this.workService.getSeriesList(series.id).then(data => {
        this.seriesChildList = data[0];
      });
    }
  }

  openHelp() {
    const dialogRef = this.help.open(FormFilterHelpComponent);
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
}

@Component({
  selector: 'dhpp-form-filter-help',
  templateUrl: './formFilterHelp.html'
})
export class FormFilterHelpComponent {}
