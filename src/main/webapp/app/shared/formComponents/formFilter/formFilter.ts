import { Component, ElementRef, Injectable, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { HistoryService } from '../../historyService';
import { classFilterT, FilterClassExtendedI, FilterClassI, FilterLabelI, OptionsI, QueryParameterI } from '../../mhdbdb-graph.service';
import { FormDirective } from '../formDirective';
import { GlobalSearchEntityClass } from 'app/globalSearch/globalSearch.class';
import { Concept } from 'app/concept/concept.class';
import { BehaviorSubject, merge, Observable } from 'rxjs';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { debounceTime, distinctUntilChanged, map, startWith } from 'rxjs/operators';
import { WorkService } from 'app/work/work.service';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { SeriesClass, WorkClass } from 'app/work/work.class';
import { FlatTreeControl } from '@angular/cdk/tree';
import { CollectionViewer, DataSource, SelectionChange } from '@angular/cdk/collections';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { TokenFilterI } from 'app/text/textPassage.service';
import { Store } from '@ngrx/store';

@Component({
  selector: 'dhpp-form-filter',
  templateUrl: './formFilter.html',
  styleUrls: ['./formFilter.scss']
})
export class FormFilterComponent<qT extends QueryParameterI<f, o>, f extends FilterClassExtendedI, o extends OptionsI, instanceClass>
  extends FormDirective<qT, f, o, instanceClass>
  implements OnInit, OnDestroy {
  filterConcepts;
  filterSeries;
  filterWorks;

  workList: WorkClass[] = [];
  seriesList: SeriesClass[] = [];
  seriesChildList: SeriesClass[] = [];
  conceptLabels: string[] = [];
  seriesLabels: string[] = [];

  filterSeriesGroup: any[] = [];

  filterSeriesCheckboxes: FormGroup;

  labelAuthorTimeSearch = 'Lebensdaten AutorIn';

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
    super(historyService, help);

    // Autocomplete for concepts field
    this.filteredConcepts = this.conceptCtrl.valueChanges.pipe(
      startWith(null),
      map((concept: string | null) => (concept ? this._filterConcept(concept) : this.conceptLabels.slice()))
    );
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

  initHtmlForm(filterMap: f) {
    this.form = new FormGroup({
      label: new FormControl(filterMap.label),
      isLabelActive: new FormControl(filterMap.isLabelActive),
      isSeriesFilterActive: new FormControl(filterMap.isSeriesFilterActive),
      isConceptsActive: new FormControl(filterMap.isConceptsActive),
      isWorksActive: new FormControl(filterMap.isWorksActive),
      works: new FormControl(''),
      series: new FormControl('')
    });

    /*  this.workList.forEach(work => {
      this.conceptLabels.push(work.label);
      if (filterMap.concepts.includes(work.id)) {
        this.filterWorks.addControl(work.label.trim(), new FormControl(true));
      }
    });
*/

    this.filterSeriesCheckboxes = new FormGroup({});
    this.seriesList.forEach(item => {
      if (filterMap && filterMap.seriesFilter && filterMap.seriesFilter.includes(item.id)) {
        this.filterSeriesCheckboxes.addControl(item.label, new FormControl(true));
      } else {
        this.filterSeriesCheckboxes.addControl(item.label, new FormControl(false));
      }
    });
  }

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

    /* this.workList.forEach(concept => {
      this.concepts.removeControl(concept.label);
    }); */

    /* filterMap.concepts.forEach(
      conceptUri => {
        const concept = this.workList.find(element => element.id == conceptUri)
        if (concept) {
          this.concepts.addControl(concept.label.trim(), new FormControl(true))
        } else {
          console.error("concept not found: " + conceptUri)
        }

      }
    ) */
  }

  handleOnClick(event) {
    console.log(event);
  }

  onValueChanges(value) {
    console.log(value);

    if (this.qp.filter.isSeriesFilterActive != value.isSeriesFilterActive) {
      this.qp.filter.isSeriesFilterActive = value.isSeriesFilterActive;
    }

    if (this.qp.filter.isLabelActive != value.isLabelActive) {
      this.qp.filter.isLabelActive = value.isLabelActive;
    }
    if (this.qp.filter.label != value.label) {
      this.qp.filter.label = value.label;
    }

    this.qp.filter.series = [];
    for (let v in value.filterSeries) {
      const e = this.seriesList.find(element => element.label === v);
      this.qp.filter.series.push(e.id);
    }

    /* this.qp.filter.isConceptsActive = value.isConceptsActive
    this.qp.filter.concepts = []
    for (let v in value.filterConcepts) {
      const e = this.workList.find(element => element.label === v)
      this.qp.filter.concepts.push(e.id)
    } */

    if (this.qp.filter.isWorksActive != value.isWorksActive) {
      this.qp.filter.isWorksActive = value.isWorksActive;
    }

    this.qp.filter.works = [];

    if (Array.isArray(value.works)) {
      value.works.map(v => {
        const e = this.workList.find(element => element.label === v);
        this.qp.filter.works.push(e.id);
      });
    }

    console.log(this.qp.filter);

    return true;
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

  ngOnInit() {
    super.ngOnInit();
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
  }
}

@Component({
  selector: 'dhpp-form-filter-help',
  templateUrl: './formFilterHelp.html'
})
export class FormFilterHelpComponent {}
