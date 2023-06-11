import { Component, ElementRef, Injectable, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { HistoryService } from '../../historyService';
import { classFilterT, FilterClassExtendedI, FilterClassI, FilterLabelI, OptionsI, QueryParameterI } from '../../mhdbdb-graph.service';
import { FormDirective } from '../formDirective';
import { GlobalSearchEntityClass } from 'app/globalSearch/globalSearch.class';
import { Concept } from 'app/concept/concept.class';
import { BehaviorSubject, merge, Observable, Subject, Subscription } from 'rxjs';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { debounceTime, distinctUntilChanged, map, startWith, takeUntil } from 'rxjs/operators';
import { WorkService } from 'app/work/work.service';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { SeriesClass, WorkClass } from 'app/work/work.class';
import { FlatTreeControl } from '@angular/cdk/tree';
import { CollectionViewer, DataSource, SelectionChange } from '@angular/cdk/collections';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { TokenFilterI } from 'app/text/textPassage.service';
import { Store, select } from '@ngrx/store';
import { defaultFilterClassExtended, selectFilterClassExtended } from 'app/store/general-filter.reducer';
import {
  setLabelActive,
  setSeriesFilterActive,
  setWorksActive,
  updateLabel,
  setAuthorActive,
  updateWorks,
  updateSeries
} from 'app/store/general-filter.actions';

@Component({
  selector: 'dhpp-form-filter',
  templateUrl: './formFilter.html',
  styleUrls: ['./formFilter.scss']
})
export class FormFilterComponent<qT extends QueryParameterI<f, o>, f extends FilterClassExtendedI, o extends OptionsI, instanceClass>
  implements OnInit, OnDestroy {
  form: FormGroup;
  private destroy$ = new Subject<void>();

  filterConcepts;
  filterSeries;
  filterWorks;

  filterMap;

  workList: WorkClass[] = [];
  seriesList: SeriesClass[] = [];
  seriesChildList: SeriesClass[] = [];
  conceptLabels: string[] = [];
  seriesLabels: string[] = [];
  filterWorksTemp = [];
  filterSeriesTemp = [];

  filterSeriesGroup: any[] = [];

  filterSeriesCheckboxes: FormGroup;
  filterWorksCheckboxes: FormGroup;

  labelAuthorTimeSearch = 'Lebensdaten AutorIn';

  private filter$: Subscription;

  minValue: number = 900;
  maxValue: number = 1200;
  /* options: Options = {
    floor: 700,
    ceil: 1600,
    step: 100,
    showTicks: true
  }; */

  // chips input for concepts
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  selectable = true;
  removable = true;
  addOnBlur = true;
  visible = true;

  workCtrl = new FormControl();

  // autocomplete concepts
  conceptCtrl = new FormControl();
  filteredConcepts: Observable<string[]>;

  @ViewChild('conceptInput', { static: false }) conceptInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto', { static: false }) matAutocomplete: MatAutocomplete;

  constructor(
    public historyService: HistoryService<qT, f, o, instanceClass>,
    public help: MatDialog,
    public workService: WorkService,
    private store: Store
  ) {
    // Autocomplete for concepts field
    this.filteredConcepts = this.conceptCtrl.valueChanges.pipe(
      startWith(null),
      map((concept: string | null) => (concept ? this._filterConcept(concept) : this.conceptLabels.slice()))
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

    this.filterWorksCheckboxes = new FormGroup({});
    this.workList.forEach(work => {
      if (this.filterMap && this.filterMap.works && this.filterMap.works.includes(work.id)) {
        this.filterWorksCheckboxes.addControl(work.label, new FormControl(true));
      } else {
        this.filterWorksCheckboxes.addControl(work.label, new FormControl(false));
      }
    });

    this.form = new FormGroup({
      label: new FormControl(this.filterMap.label),
      isLabelActive: new FormControl(this.filterMap.isLabelActive),
      isSeriesFilterActive: new FormControl(this.filterMap.isSeriesFilterActive),
      isConceptsActive: new FormControl(this.filterMap.isConceptsActive),
      isWorksActive: new FormControl(this.filterMap.isWorksActive),
      isAuthorActive: new FormControl(this.filterMap.isAuthorActive),
      works: new FormControl([]),
      series: new FormControl([]),
      filterSeriesCheckboxes: this.filterSeriesCheckboxes
    });

    this.workService.getWorkList().then(data => {
      this.workList = data[0];
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
        this.form.disable({ emitEvent: false }); // disable form to prevent emitting events while patching values
        this.form.patchValue(tokenFilter, { emitEvent: false });
        this.form.enable({ emitEvent: false }); // re-enable form after patching values

        this.filterMap = { ...tokenFilter }; // update filterMap after patching the form
      });

    this.form.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(value => {
        console.log(value);

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

        if (Array.isArray(value.works && value.works.length > 0)) {
          this.filterWorksTemp = [];
          value.works.map(v => {
            const e = this.workList.find(element => element.label === v);
            this.filterWorksTemp.push(e.id);
          });
          console.log('Dispatching works:', this.filterWorksTemp);

          this.store.dispatch(updateWorks({ works: this.filterWorksTemp }));
          this.form.get('works').setValue(this.filterWorksTemp, { emitEvent: false });
        }

        if (Array.isArray(value.series && value.series.length > 0)) {
          this.filterSeriesTemp = [];
          value.series.map(v => {
            const e = this.seriesList.find(element => element.label === v);
            this.filterSeriesTemp.push(e.id);
          });
          console.log('Dispatching series:', this.filterSeriesTemp);

          this.store.dispatch(updateSeries({ series: this.filterSeriesTemp }));
          this.form.get('series').setValue(this.filterSeriesTemp, { emitEvent: false });
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private _filterConcept(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.conceptLabels.filter(concept => concept.toLowerCase().indexOf(filterValue) === 0);
  }

  get concepts() {
    return <FormGroup>this.form.get('filterConcepts');
  }

  get series() {
    return <FormGroup>this.form.get('filterSeries');
  }

  get works() {
    return <FormControl>this.form.get('works');
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

  /*

  loadFilter(filterMap: f) {
    this.workService.getWorkList().then(data => {
      this.workList = data[0];
    });

    this.workService.getSeriesParentList().then(data => {
      this.seriesList = data[0];
    });

    if (this.form.get('isLabelActive').value != filterMap.isLabelActive) {
      this.form.patchValue({
        isLabelActive: filterMap.isLabelActive
      });
    }

    if (this.form.get('label').value != filterMap.label) {
      this.form.patchValue({
        label: filterMap.label
      });
    }

    if (this.form.get('isSeriesFilterActive').value != filterMap.isSeriesFilterActive) {
      this.form.patchValue({
        isSeriesFilterActive: filterMap.isSeriesFilterActive
      });
    }

    if (this.form.get('isConceptsActive').value != filterMap.isConceptsActive) {
      this.form.patchValue({
        isConceptsActive: filterMap.isConceptsActive
      });
    }

    if (this.form.get('isWorksActive').value != filterMap.isWorksActive) {
      this.form.patchValue({
        isWorksActive: filterMap.isWorksActive
      });
    }

    this.workList.forEach(concept => {
      this.concepts.removeControl(concept.label);
    });

    filterMap.concepts.forEach(
      conceptUri => {
        const concept = this.workList.find(element => element.id == conceptUri)
        if (concept) {
          this.concepts.addControl(concept.label.trim(), new FormControl(true))
        } else {
          console.error("concept not found: " + conceptUri)
        }

      }
    )
  }
  */

  handleOnClick(event) {
    console.log(event);
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
