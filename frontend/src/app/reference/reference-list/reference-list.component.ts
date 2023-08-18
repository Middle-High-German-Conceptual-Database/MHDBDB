import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ListHistoryEntry } from '../../shared/history.class';
import { HistoryService } from '../../shared/historyService';
import { ElectronicText, TextPassage } from '../reference.class';
import {
  TokenFilterI,
  TextPassageFilterI,
  TextPassageOptionsI,
  TextPassageQueryParameterI,
  TextPassageService,
  defaultTokenFilter
} from '../referencePassage.service';
import { BaseIndexListDirective } from 'app/shared/baseIndexComponent/list/list.component';
import { TextFilterI, TextOptionsI, TextQueryParameterI, TextService } from 'app/reference/reference.service';
import { DictionaryQueryParameterI, DictionaryService } from 'app/dictionary/dictionary.service';
import { WordClass } from 'app/dictionary/dictionary.class';
import { WorkQueryParameterI } from 'app/work/work.service';
import { Utils } from 'app/shared/utils';
import { PoS } from 'app/shared/pos/pos.class';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import {
  addTokenFilter,
  removeFilter,
  updateFilter,
  moveTokenFilterUp,
  moveTokenFilterDown,
  reset,
  updateRelation,
  updateFilterById
} from 'app/store/filter.actions';
import { selectFilter, selectTokenFilterById, selectTokenFilters } from 'app/store/filter.reducer';
import { SparqlQuery } from 'app/shared/mhdbdb-graph.service';
import { MatRadioChange } from '@angular/material/radio';
import { take } from 'rxjs/operators';
import { selectFilterClassExtended } from 'app/store/general-filter.reducer';
import { showDialog } from 'app/store/ui.actions';

@Component({
  selector: 'dhpp-reference-list',
  templateUrl: './reference-list.component.html',
  styleUrls: ['reference-list.component.scss']
})
export class TextListComponent extends BaseIndexListDirective<TextQueryParameterI, TextFilterI, TextOptionsI, ElectronicText>
  implements OnInit, OnDestroy {
  filters: any[] = [{ id: 1, name: 'erster filter' }];
  labelTextSearch = 'Lemma';
  labelPosSearch = 'Wortart';
  labelConceptSearch = 'Begriffe';
  labelSeriesSearch = 'Textreihe (Gattung)';

  labelAuthorSearch = 'AutorIn';
  tokenFilter?: TokenFilterI;

  textInstances: WordClass[] = [];

  tokenFilters$: Observable<TokenFilterI[]>;
  filters$: Observable<any>;
  generalFilter$: Observable<any>;

  filter: any;
  generalFilter: any;

  relation: string = 'and';

  selectedFilter: TokenFilterI;

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public locationService: Location,
    public http: HttpClient,
    public service: TextService, // --> service
    public dicService: DictionaryService,
    public history: HistoryService<TextQueryParameterI, TextFilterI, TextOptionsI, ElectronicText>,
    public store: Store
  ) {
    super(router, route, locationService, http, service, history);
    this.tokenFilters$ = this.store.pipe(select(selectTokenFilters));
    this.filters$ = this.store.pipe(select(selectFilter));
    this.generalFilter$ = this.store.pipe(select(selectFilterClassExtended));

    this.filters$.subscribe(f => {
      this.filter = f;
    });

    this.generalFilter$.subscribe(f => {
      this.generalFilter = f;
    });
  }

  openDialog() {
    this.store.dispatch(showDialog({ title: 'Test Title 1', content: 'Test Content' }));
  }

  ////////////////////
  // Requests
  ////////////////////

  public addFilter() {
    this.store.dispatch(addTokenFilter({ tokenFilter: defaultTokenFilter }));
  }

  public removeFilter(indexToRemove: number) {
    this.store.dispatch(removeFilter({ filterIndex: indexToRemove }));
  }

  public moveUp(indexToMove: number) {
    this.store.dispatch(moveTokenFilterUp({ filterIndex: indexToMove }));
  }

  public moveDown(indexToMove: number) {
    this.store.dispatch(moveTokenFilterDown({ filterIndex: indexToMove }));
  }

  onRelationChange(event: MatRadioChange, filterId: string) {
    this.store
      .pipe(
        select(selectTokenFilterById, { id: filterId }),
        take(1)
      )
      .subscribe(filter => {
        const updatedFilter = { ...filter, relation: event.value };
        this.store.dispatch(updateFilterById({ filterId: filterId, newFilter: updatedFilter }));
      });
  }

  ngOnInit() {
    super.ngOnInit();
    this.isLoading = false;

    // this.loadSenses()
  }

  reset() {
    this.textInstances = [];
    this.store.dispatch(reset());
    this.isLoading = false;
  }

  search() {
    this.isLoading = true;
    const sparql = this.service.sparqlQuery({ ...this.generalFilter, filter: this.filter }, false);
    const _sq = new SparqlQuery();

    _sq.query(sparql).then(data => {
      this.instances = this.service._jsonToObject(data.results.bindings);
    });
    this.isLoading = false;
  }
}
