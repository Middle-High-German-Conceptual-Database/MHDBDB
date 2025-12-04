import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
  constructor(private router: Router, private activatedRoute: ActivatedRoute) {}

  ngOnInit() {}

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  // Wird nur noch von auskommentierten Menüpunkten verwendet
  isHomePage() {
    return this.router.url === '/' || this.router.url === '/home';
  }
}
