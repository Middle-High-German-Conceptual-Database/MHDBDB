import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { WordClass } from '../../../dictionary/dictionary.class';
import { DictionaryFilterI, DictionaryOptionsI, DictionaryQueryParameterI, DictionaryService } from '../../../dictionary/dictionary.service';
import { ViewWidgetsDirective } from '../viewWidgetsDirective';
import { ActivatedRoute, Router } from '@angular/router';
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';


@Component({
    selector: 'dhpp-widget-wordformation',
    templateUrl: './wordFormationWidget.html',
    styleUrls: ['./wordFormationWidget.scss']
})
export class WordFormationWidgetComponent extends ViewWidgetsDirective<DictionaryQueryParameterI, DictionaryFilterI, DictionaryOptionsI, WordClass, DictionaryService> implements OnInit {
    words: WordClass[] = []
  view: any;
    public title: string ="Wortbildung"
    constructor(
        public service: DictionaryService,
        public help: MatDialog,
        public router: Router,
        public route: ActivatedRoute,
        public locationService: Location,
        public http: HttpClient,
    ) {
        super(service, help)
    }

    ngOnInit(): void {
        super.ngOnInit()
        if (this.instance) {
            this.service.getWordFormations(this.instance).then( data => {
                this.words = data[0]
                this.total = data[1]
                this.isLoaded = Promise.resolve(true)
            })
        }
    }

    openHelp() {
        const dialogRef = this.help.open(WordFormationWidgetHelpComponent);
        dialogRef.afterClosed().subscribe(result => {
            console.log(`Dialog result: ${result}`);
        });
    }

}

@Component({
    selector: 'dhpp-widget-wordformation-help',
    templateUrl: './wordFormationWidgetHelp.html',
})
export class WordFormationWidgetHelpComponent { }
