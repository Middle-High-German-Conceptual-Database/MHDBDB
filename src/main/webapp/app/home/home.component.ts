import { Component, OnInit, OnDestroy } from '@angular/core';

// The base module exports all classes that are necessary.
import { Account, AccountService, EventManager, NavbarService } from '../../../../../src/main/webapp/app/shared/base.imports';
// Every Component should inherit from the BaseComponent
import { BaseComponent } from '../../../../../src/main/webapp/app/shared/base.imports';

import { SparqlJsonParser } from "sparqljson-parse";

const sparqlJsonParser = new SparqlJsonParser();


@Component({
  selector: 'dhpp-app-home',
  templateUrl: './home.component.html',
  styleUrls: ['home.component.scss']
})
export class AppHomeComponent implements OnInit, OnDestroy {

  fakeArray = new Array(4);
  showNavbar = true; // Show navbar on first init

  testdata: any;

  items: ["Eintrag 1", "Eintrag 2", "Eintrag 3"];

  constructor(public accountService: AccountService,
    public navbarService: NavbarService,
    public eventService: EventManager
    ) {

  }

  ngOnInit() {

  }

  ngOnDestroy() {

  }

  toggleNavbar() {
    this.navbarService.toggleNavbar();
  }
}
