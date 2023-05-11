import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ListHistoryEntry } from '../../shared/history.class';
import { HistoryService } from '../../shared/historyService';
import {ElectronicText, TextPassage} from '../reference.class';
import { TokenFilterI, TextPassageFilterI, TextPassageOptionsI, TextPassageQueryParameterI, TextPassageService, defaultTokenFilter } from '../referencePassage.service';
import {BaseIndexListDirective} from "app/shared/baseIndexComponent/list/list.component";
import {
  TextFilterI,
  TextOptionsI,
  TextQueryParameterI,
  TextService
} from "app/reference/reference.service";
import {DictionaryQueryParameterI, DictionaryService} from "app/dictionary/dictionary.service";
import {WordClass} from "app/dictionary/dictionary.class";
import {WorkQueryParameterI} from "app/work/work.service";
import {Utils} from "app/shared/utils";
import {PoS} from "app/shared/pos/pos.class";

@Component({
    selector: 'dhpp-reference-list',
    templateUrl: './reference-list.component.html',
    styleUrls: ['reference-list.component.scss']
})
export class TextListComponent extends BaseIndexListDirective<TextQueryParameterI, TextFilterI, TextOptionsI, ElectronicText> implements OnInit, OnDestroy {

  filters: any[] = [{ id: 1, name: 'erster filter'}];
  labelTextSearch = 'Lemma';
  labelPosSearch = 'Wortart';
  labelConceptSearch = 'Begriffe';
  labelSeriesSearch = 'Textreihe (Gattung)';

  labelAuthorSearch = 'AutorIn';
  tokenFilter?: TokenFilterI;

  textInstances: WordClass[] = [];

  constructor(
        public router: Router,
        public route: ActivatedRoute,
        public locationService: Location,
        public http: HttpClient,
        public service: TextService, // --> service
        public dicService: DictionaryService,
        public history: HistoryService<TextQueryParameterI, TextFilterI, TextOptionsI, ElectronicText>,

    ) {
        super(router, route, locationService, http, service, history)
    }

    ////////////////////
    // Requests
    ////////////////////

  public addFilter() {
    this.filters.push({ id: 2, name: 'zweiter filter' });

  }

  public removeFilter(i: number) {
    this.filters.splice(i, 1);
  }

  ngOnInit() {
    super.ngOnInit();
    this.loadSenses()
  }

  reset() {
      this.textInstances = [];
  }
  loadSenses() {

    let newQp =
      {
        "order": "label",
        "limit": 10,
        "offset": 0,
        "desc": false,
        "lang": "de",
        "namedGraphs": "https://dh.plus.ac.at/mhdbdb/namedGraph/mhdbdbMeta",
        "filter": {
          "label": this.qp && this.qp.filter && this.qp.filter.tokenFilters[0].label || '',
          "isLabelActive": true,
          "pos": [],
          "isPosActive": true,
          "concepts": [],
          "isConceptsActive": true,
          "hasSubterms": true,
          "workId": ''
        },
        "option": {
          "useLucene": false
        }
      } as DictionaryQueryParameterI;


    let workInstances = [];

    // 1. search for words
    this.dicService.getInstances(newQp).then(data => {

      data.forEach((word: WordClass) => {

        // check if workInstances contains id
        if (word.texts && word.texts.length > 0) {
          word.texts.forEach((text: PoS) => {

            let i = workInstances.findIndex((item: any) => item.id === text);

            if (i == -1) {
              workInstances.push({ strippedId: text.strippedId, id: text.id, label: text.label, words: [word] });
            } else {
              workInstances[i].words.push(word);
            }
          })
        }
      })

      this.textInstances = workInstances;

 /*
*/

        /* let tempWord = new WordClass(word.id, newQp.filter.label);
        this.dicService.getSenses(tempWord).then(data => {
          console.log(data);
          this.senses = data
          this.total = data.length
        }) */

      });

  }

}
