import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
// import { GlobalSearchEntityClass } from '../../globalSearch/globalSearch.class';
// import { GlobalSearchFilterI, GlobalSearchOptionsI, GlobalSearchQueryParameterI, GlobalSearchService } from '../../globalSearch/globalSearch.service';
import { ListHistoryEntry } from '../history.class';
import { HistoryService } from '../historyService';

@Component({
  selector: 'dhpp-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class DhppHeaderComponent implements OnInit, OnDestroy {
  form;
  subscription: Subscription;
  constructor(private router: Router) {}

  ngOnInit() {}

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
