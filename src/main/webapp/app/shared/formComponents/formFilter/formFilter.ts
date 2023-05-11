import {Component, ElementRef, Injectable, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {HistoryService} from '../../historyService';
import {
  classFilterT,
  FilterClassExtendedI,
  FilterClassI,
  FilterLabelI,
  OptionsI,
  QueryParameterI,
} from '../../mhdbdb-graph.service';
import {FormDirective} from '../formDirective';
import {Options} from "@angular-slider/ngx-slider";
import {GlobalSearchEntityClass} from "app/globalSearch/globalSearch.class";
import {Concept} from "app/concept/concept.class";
import {BehaviorSubject, merge, Observable} from "rxjs";
import {MatAutocomplete, MatAutocompleteSelectedEvent} from "@angular/material/autocomplete";
import {map, startWith} from "rxjs/operators";
import {WorkService} from "app/work/work.service";
import {COMMA, ENTER} from "@angular/cdk/keycodes";
import {SeriesClass, WorkClass} from "app/work/work.class";
import {FlatTreeControl} from "@angular/cdk/tree";
import {CollectionViewer, DataSource, SelectionChange} from "@angular/cdk/collections";
import { MatCheckboxChange } from '@angular/material/checkbox';



/** Flat node with expandable and level information */
export class DynamicFlatNode {
  constructor(
    public item: string,
    public level = 1,
    public expandable = false,
    public isLoading = false,
  ) {}
}

/**
 * Database for dynamic data. When expanding a node in the tree, the data source will need to fetch
 * the descendants data from the database.
 */
@Injectable({providedIn: 'root'})
export class DynamicDatabase {
  dataMap = new Map<string, string[]>([
    ['Fruits', ['Apple', 'Orange', 'Banana']],
    ['Vegetables', ['Tomato', 'Potato', 'Onion']],
    ['Apple', ['Fuji', 'Macintosh']],
    ['Onion', ['Yellow', 'White', 'Purple']],
  ]);

  rootLevelNodes: string[] = ['Fruits', 'Vegetables'];

  /** Initial data from database */
  initialData(): DynamicFlatNode[] {
    return this.rootLevelNodes.map(name => new DynamicFlatNode(name, 0, true));
  }

  getChildren(node: string): string[] | undefined {
    return this.dataMap.get(node);
  }

  isExpandable(node: string): boolean {
    return this.dataMap.has(node);
  }
}
/**
 * File database, it can build a tree structured Json object from string.
 * Each node in Json object represents a file or a directory. For a file, it has filename and type.
 * For a directory, it has filename and children (a list of files or directories).
 * The input will be a json object string, and the output is a list of `FileNode` with nested
 * structure.
 */
export class DynamicDataSource implements DataSource<DynamicFlatNode> {
  dataChange = new BehaviorSubject<DynamicFlatNode[]>([]);

  get data(): DynamicFlatNode[] {
    return this.dataChange.value;
  }
  set data(value: DynamicFlatNode[]) {
    this._treeControl.dataNodes = value;
    this.dataChange.next(value);
  }

  constructor(
    private _treeControl: FlatTreeControl<DynamicFlatNode>,
    private _database: DynamicDatabase,
  ) {}

  connect(collectionViewer: CollectionViewer): Observable<DynamicFlatNode[]> {
    this._treeControl.expansionModel.changed.subscribe(change => {
      if (
        (change as SelectionChange<DynamicFlatNode>).added ||
        (change as SelectionChange<DynamicFlatNode>).removed
      ) {
        this.handleTreeControl(change as SelectionChange<DynamicFlatNode>);
      }
    });

    return merge(collectionViewer.viewChange, this.dataChange).pipe(map(() => this.data));
  }

  disconnect(collectionViewer: CollectionViewer): void {}

  /** Handle expand/collapse behaviors */
  handleTreeControl(change: SelectionChange<DynamicFlatNode>) {
    if (change.added) {
      change.added.forEach(node => this.toggleNode(node, true));
    }
    if (change.removed) {
      change.removed
        .slice()
        .reverse()
        .forEach(node => this.toggleNode(node, false));
    }
  }

  /**
   * Toggle the node, remove from display list
   */
  toggleNode(node: DynamicFlatNode, expand: boolean) {
    const children = this._database.getChildren(node.item);
    const index = this.data.indexOf(node);
    if (!children || index < 0) {
      // If no children, or cannot find the node, no op
      return;
    }

    node.isLoading = true;

    setTimeout(() => {
      if (expand) {
        const nodes = children.map(
          name => new DynamicFlatNode(name, node.level + 1, this._database.isExpandable(name)),
        );
        this.data.splice(index + 1, 0, ...nodes);
      } else {
        let count = 0;
        for (
          let i = index + 1;
          i < this.data.length && this.data[i].level > node.level;
          i++, count++
        ) {}
        this.data.splice(index + 1, count);
      }

      // notify the change
      this.dataChange.next(this.data);
      node.isLoading = false;
    }, 1000);
  }
}


@Component({
  selector: 'dhpp-form-filter',
  templateUrl: './formFilter.html',
  styleUrls: ['./formFilter.scss']
})
export class FormFilterComponent<qT extends QueryParameterI<f, o>, f extends FilterClassExtendedI, o extends OptionsI, instanceClass> extends FormDirective<qT, f, o, instanceClass> implements OnInit, OnDestroy {

  filterConcepts
  filterSeries

  public counter = 21;

  workList: WorkClass[] = [];
  seriesList: SeriesClass[] = [];
  seriesChildList: SeriesClass[] = [];
  conceptLabels: string[] = [];
  seriesLabels: string[] = [];

  filterSeriesGroup: any[] = [];

  filterSeriesCheckboxes: FormGroup

  labelAuthorTimeSearch = 'Lebensdaten AutorIn';

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

  // autocomplete concepts
  conceptCtrl = new FormControl();
  filteredConcepts: Observable<string[]>;

  @ViewChild('conceptInput', {static: false}) conceptInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto', {static: false}) matAutocomplete: MatAutocomplete;

  constructor(
    public historyService: HistoryService<qT, f, o, instanceClass>,
    public help: MatDialog,
    public workService: WorkService,
    database: DynamicDatabase
  ) {
    super(historyService, help);

    this.treeControl = new FlatTreeControl<DynamicFlatNode>(this.getLevel, this.isExpandable);
    this.dataSource = new DynamicDataSource(this.treeControl, database);

    this.dataSource.data = database.initialData();

    this.filteredConcepts = this.conceptCtrl.valueChanges.pipe(
      startWith(null),
      map((concept: string | null) => concept ? this._filterConcept(concept) : this.conceptLabels.slice()));

  }

  treeControl: FlatTreeControl<DynamicFlatNode>;

  dataSource: DynamicDataSource;

  getLevel = (node: DynamicFlatNode) => node.level;

  isExpandable = (node: DynamicFlatNode) => node.expandable;

  hasChild = (_: number, _nodeData: DynamicFlatNode) => _nodeData.expandable;

  private _filterConcept(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.conceptLabels.filter(concept => concept.toLowerCase().indexOf(filterValue) === 0);
  }


  public handleOnClick(stateCounter: number) {
    this.counter++;
  }

  get concepts() {
    return <FormGroup>this.form.get('filterConcepts')
  }

  /*get series() {
    return <FormGroup>this.form.get('filterSeries')
  }*/

  removeConcept(conceptLabel: string): void {
    this.concepts.removeControl(conceptLabel);
    this.concepts.updateValueAndValidity();
  }

  selectedConcept(event: MatAutocompleteSelectedEvent): void {
    this.concepts.addControl(event.option.viewValue, new FormControl(true))
    this.conceptInput.nativeElement.value = '';
    this.conceptCtrl.setValue(null);
  }

  initHtmlForm(filterMap: f) {

    this.filterConcepts = new FormGroup({});

    this.filterSeriesCheckboxes = new FormGroup({});
    this.seriesList.forEach(
      (item) => {
        if (filterMap && filterMap.seriesFilter && filterMap.seriesFilter.includes(item.id)) {
          this.filterSeriesCheckboxes.addControl(item.label, new FormControl(true))
        } else {
          this.filterSeriesCheckboxes.addControl(item.label, new FormControl(false))
        }
      }
    )

    this.workList.forEach((concept) => {
      this.conceptLabels.push(concept.label)
      if (filterMap.concepts.includes(concept.id)) {
        this.concepts.addControl(concept.label.trim(), new FormControl(true))
      }
    })

    this.form = new FormGroup({
      label: new FormControl(filterMap.label),
      isLabelActive: new FormControl(filterMap.isLabelActive),
      filterSeriesCheckboxes: this.filterSeriesCheckboxes,
      isSeriesFilterActive: new FormControl(filterMap.isSeriesFilterActive),
      filterConcepts: this.filterConcepts,
      filterSeries: this.filterSeries,
      isConceptsActive: new FormControl(filterMap.isConceptsActive),
      works: new FormControl(''),
      series: new FormControl(''),
    });
  }

  loadFilter(filterMap: f) {
    if (this.form.get('isLabelActive').value != filterMap.isLabelActive) {
      this.form.patchValue({
        isLabelActive: filterMap.isLabelActive,
      })
    }

    if (this.form.get('label').value != filterMap.label) {
      this.form.patchValue({
        label: filterMap.label,
      })
    }

    if (this.form.get('isSeriesFilterActive').value != filterMap.isSeriesFilterActive) {
      this.form.patchValue({
        isSeriesFilterActive: filterMap.isSeriesFilterActive,
      })
    }

    if (this.form.get('isConceptsActive').value != filterMap.isConceptsActive) {
      this.form.patchValue({
        isConceptsActive: filterMap.isConceptsActive,
      })
    }

    this.workList.forEach(
      concept => {
        this.concepts.removeControl(concept.label);
      }
    )

    this.seriesList.forEach(
      series => {
      //  this.series.removeControl(series.label);
      }
    )

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

  onValueChanges(value) {
    let changed: boolean = false
    if (this.qp.filter.isLabelActive != value.isLabelActive) {
      this.qp.filter.isLabelActive = value.isLabelActive
      changed = true
    }
    if (this.qp.filter.label != value.label) {
      this.qp.filter.label = value.label
      changed = true
    }

    this.qp.filter.isSeriesActive = value.isSeriesActive
    this.qp.filter.series = []
    for (let v in value.filterSeries) {
      const e = this.seriesList.find(element => element.label === v)
      this.qp.filter.series.push(e.id)
    }

    this.qp.filter.isConceptsActive = value.isConceptsActive
    this.qp.filter.concepts = []
    for (let v in value.filterConcepts) {
      const e = this.workList.find(element => element.label === v)
      this.qp.filter.concepts.push(e.id)
    }

    return changed
  }

  onSeriesChange(event: MatCheckboxChange, series: SeriesClass) {
    if (event.checked) {
      this.workService.getSeriesList(series.id).then(
        data => {
          this.seriesChildList = data[0];
        }
      )
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

   this.workService.getWorkList().then(
      data => {
        this.workList = data[0];
      }
    )

    this.workService.getSeriesParentList().then(
      data => {
        this.seriesList = data[0];
      }
    )
  }

  ngOnDestroy(): void {
    super.ngOnDestroy()
  }
}



@Component({
  selector: 'dhpp-form-filter-help',
  templateUrl: './formFilterHelp.html',
})
export class FormFilterHelpComponent {
}
