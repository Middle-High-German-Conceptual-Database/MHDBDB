import { Component, OnInit, OnDestroy } from '@angular/core';

// The base module exports all classes that are necessary.
import { Account, AccountService, EventManager, LoginModalService, NavbarService } from '../../../../../src/main/webapp/app/shared/base.imports';
// Every Component should inherit from the BaseComponent
import { BaseComponent } from '../../../../../src/main/webapp/app/shared/base.imports';

import { SparqlJsonParser } from "sparqljson-parse";

const sparqlJsonParser = new SparqlJsonParser();


@Component({
  selector: 'dhpp-app-home',
  templateUrl: './home.component.html',
  styleUrls: ['home.component.scss']
})
export class AppHomeComponent extends BaseComponent implements OnInit, OnDestroy {

  fakeArray = new Array(4);
  showNavbar = true; // Show navbar on first init

  testdata: any;

  items: ["Eintrag 1", "Eintrag 2", "Eintrag 3"];

  constructor(public accountService: AccountService,
    public loginModalService: LoginModalService,
    public navbarService: NavbarService,
    public eventService: EventManager
    ) {
    super(accountService, loginModalService, eventService);
  }

  ngOnInit() {
    this.accountService.identity().subscribe((account: Account) => {
      this.account = account;
    });
    this.registerAuthenticationSuccess();
    // this.navbarService.show(); // Show Navbar by default

    const sparqlJsonresponse =
    {
      "head": {
        "vars": [
          "subject",
          "predicate",
          "object"
        ]
      },
      "results": {
        "bindings": [
          {
            "subject": {
              "type": "uri",
              "value": "http://mhdbdb.sbg.ac.at/instance#concept_11300000"
            },
            "predicate": {
              "type": "uri",
              "value": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"
            },
            "object": {
              "type": "uri",
              "value": "http://www.w3.org/ns/lemon/ontolex#LexicalConcept"
            }
          },
          {
            "subject": {
              "type": "uri",
              "value": "http://mhdbdb.sbg.ac.at/instance#concept_11300000"
            },
            "predicate": {
              "type": "uri",
              "value": "http://www.w3.org/2004/02/skos/core#broader"
            },
            "object": {
              "type": "uri",
              "value": "http://mhdbdb.sbg.ac.at/instance#concept_11000000"
            }
          },
          {
            "subject": {
              "type": "uri",
              "value": "http://mhdbdb.sbg.ac.at/instance#concept_11300000"
            },
            "predicate": {
              "type": "uri",
              "value": "http://www.w3.org/2004/02/skos/core#inScheme"
            },
            "object": {
              "type": "uri",
              "value": "http://mhdbdb.sbg.ac.at/instance#conceptualSystem"
            }
          },
          {
            "subject": {
              "type": "uri",
              "value": "http://mhdbdb.sbg.ac.at/instance#concept_11300000"
            },
            "predicate": {
              "type": "uri",
              "value": "http://www.w3.org/2004/02/skos/core#prefLabel"
            },
            "object": {
              "type": "literal",
              "xml:lang": "de",
              "value": "Himmelsrichtungen"
            }
          },
          {
            "subject": {
              "type": "uri",
              "value": "http://mhdbdb.sbg.ac.at/instance#concept_11300000"
            },
            "predicate": {
              "type": "uri",
              "value": "http://www.w3.org/2004/02/skos/core#prefLabel"
            },
            "object": {
              "type": "literal",
              "xml:lang": "en",
              "value": "Cardinal Points"
            }
          },
          {
            "subject": {
              "type": "uri",
              "value": "http://mhdbdb.sbg.ac.at/instance#concept_11000000"
            },
            "predicate": {
              "type": "uri",
              "value": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"
            },
            "object": {
              "type": "uri",
              "value": "http://www.w3.org/ns/lemon/ontolex#LexicalConcept"
            }
          },
          {
            "subject": {
              "type": "uri",
              "value": "http://mhdbdb.sbg.ac.at/instance#concept_11000000"
            },
            "predicate": {
              "type": "uri",
              "value": "http://www.w3.org/2004/02/skos/core#broader"
            },
            "object": {
              "type": "uri",
              "value": "http://mhdbdb.sbg.ac.at/instance#concept_10000000"
            }
          },
          {
            "subject": {
              "type": "uri",
              "value": "http://mhdbdb.sbg.ac.at/instance#concept_11000000"
            },
            "predicate": {
              "type": "uri",
              "value": "http://www.w3.org/2004/02/skos/core#inScheme"
            },
            "object": {
              "type": "uri",
              "value": "http://mhdbdb.sbg.ac.at/instance#conceptualSystem"
            }
          },
          {
            "subject": {
              "type": "uri",
              "value": "http://mhdbdb.sbg.ac.at/instance#concept_11000000"
            },
            "predicate": {
              "type": "uri",
              "value": "http://www.w3.org/2004/02/skos/core#prefLabel"
            },
            "object": {
              "type": "literal",
              "xml:lang": "de",
              "value": "Himmel/Atmosphäre/Himmelskörper"
            }
          },
          {
            "subject": {
              "type": "uri",
              "value": "http://mhdbdb.sbg.ac.at/instance#concept_11000000"
            },
            "predicate": {
              "type": "uri",
              "value": "http://www.w3.org/2004/02/skos/core#prefLabel"
            },
            "object": {
              "type": "literal",
              "xml:lang": "en",
              "value": "Sky/Atmosphere/Celestial Bodies"
            }
          }
        ]
      }
    };
    this.testdata = sparqlJsonParser.parseJsonResults(sparqlJsonresponse);

    const datatable = new Map();

    const keys = ['subject', 'predicate', 'object'];
    this.testdata.forEach(function (item, index) {
      keys.forEach(function (keyItem, keyIndex) {
        // console.log(item[keyItem]);
      });
    });

  }

  ngOnDestroy() {
    if (this.authSubscription) {
      //this.eventManager.destroy(this.authSubscription);
    }
  }

  toggleNavbar() {
    this.navbarService.toggleNavbar();
  }
}
