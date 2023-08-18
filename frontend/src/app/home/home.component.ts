import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';

// The base module exports all classes that are necessary.
import { Account, EventManager, NavbarService } from 'app/shared/base.imports';
// Every Component should inherit from the BaseComponent
import { BaseComponent } from 'app/shared/base.imports';

import { SparqlJsonParser } from 'sparqljson-parse';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';

const sparqlJsonParser = new SparqlJsonParser();

@Component({
  selector: 'dhpp-app-home',
  templateUrl: './home.component.html',
  styleUrls: ['home.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppHomeComponent implements OnInit, OnDestroy {
  disableSelect = new FormControl(false);

  fakeArray = new Array(4);
  showNavbar = true; // Show navbar on first init

  searchTerm: string;
  selectFilter: boolean = false;
  searchFilterValue = 'globalSearch';

  searchFilterValues = [
    { id: 'globalSearch', name: 'Übergreifende Suche' },
    { id: 'reference', name: 'Belegsuche' },
    { id: 'dictionary', name: 'Lemmata' }
  ];

  testdata: any;

  items: ['Eintrag 1', 'Eintrag 2', 'Eintrag 3'];

  constructor(public navbarService: NavbarService, public eventService: EventManager, public router: Router) {}

  ngOnInit() {}

  ngOnDestroy() {}

  toggleNavbar() {
    this.navbarService.toggleNavbar();
  }

  findFilterValue(value: string) {
    const f = this.searchFilterValues.find(item => item.id === value);
    if (f) {
      return f.name;
    }
    return 'Übergreifende Suche';
  }

  doSearch() {
    this.router.navigateByUrl('/' + this.searchFilterValue + '/list', { state: { searchTerm: this.searchTerm } });
  }
}
