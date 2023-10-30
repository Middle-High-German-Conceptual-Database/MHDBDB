import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
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
import { Observable, from } from 'rxjs';
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
import * as referenceActions from '../../store/reference.actions';
import { selectDownloadProgress } from 'app/store/ui.reducer';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

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
  uiFilter$: Observable<any>;

  filter: any;
  generalFilter: any;

  downloadProgress: 0;

  relation: string = 'and';

  selectedFilter: TokenFilterI;

  totalAnnotations: number = -1;

  timeIsOver = false;

  isRLoading = false;

  total = 0;
  limit = 100;
  offset = 0;

  @ViewChild(MatPaginator) paginator: MatPaginator;

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
    this.uiFilter$ = this.store.pipe(select(selectDownloadProgress));

    this.filters$.subscribe(f => {
      this.filter = f;
    });

    this.generalFilter$.subscribe(f => {
      this.generalFilter = f;
    });

    this.uiFilter$.subscribe(f => {
      this.downloadProgress = f;
    });



    this.isLoading = false;
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
    this.isRLoading = false;
    // this.loadSenses()
  }

  handlePageEvent(event: PageEvent) {
    this.limit = event.pageSize;
    this.offset = event.pageIndex * event.pageSize;
    this.search(true);
  }

  reset() {
    this.textInstances = [];
    this.store.dispatch(reset());
    this.isRLoading = false;
    this.instances = [];
    this.totalAnnotations = -1;
    this.isLoading = false;
  }

  search(fromScroll: boolean) {
    this.isRLoading = true;
    this.instances = [];

    setTimeout(() => {
      if (this.totalAnnotations == -1) {
        this.timeIsOver = true;
      } else {
        this.timeIsOver = false;
      }
    }, 10000); 

    const _sq = new SparqlQuery(this.store);
  
    if (this.totalAnnotations == -1 || fromScroll == false) {
      const countResults = this.service.sparqlQuery({ ...this.generalFilter, filter: this.filter }, true);
      _sq.query(countResults).then(data => {
        if (data.results.bindings.length == 0) {
          this.totalAnnotations = 0;
        } else {
          this.totalAnnotations = data.results.bindings[0].count.value;
          this.executeQuery();
        }
      });
    } else {
      this.executeQuery();
    }
  }
  
  executeQuery() {
    this.limit = this.totalAnnotations > 2500 ? 2500 : this.totalAnnotations;
  
    const sparql = this.service.sparqlQuery({ ...this.generalFilter, filter: this.filter, limit: this.limit, offset: this.offset }, false);
    const _sq = new SparqlQuery(this.store); // If SparqlQuery instance is needed here, if not, you can remove it
    _sq.query(sparql).then(data => {
      this.instances = this.service._jsonToObject(data.results.bindings);
      this.store.dispatch(referenceActions.storeReferenceObject({ data }));
      this.store.dispatch(referenceActions.storeInstances({ data: this.instances }));
  
      // Filter data if generaFilter is set
      if (this.generalFilter && this.generalFilter.isWorksActive) {
        // filter this.instances.workId by this.generalFilter.works array
        this.instances = this.instances.filter(instance => {
          return this.generalFilter.works.includes(instance.workId);
        });
      }
      this.isRLoading = false;
      this.isLoading = false;
    });
  }
  


  onScrollDown() {
    this.offset += this.limit;
    this.search(true);
  }

  countTotalAnnotationIds(dataArray) {
    let total = 0;
    for (let item of dataArray) {
      if (item.annotationIds) {
        total += item.annotationIds.length;
      }
    }
    return total;
  }

}
