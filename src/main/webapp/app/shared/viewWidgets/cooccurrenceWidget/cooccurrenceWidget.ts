import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { WordClass, SenseClass } from '../../../dictionary/dictionary.class';
import { DictionaryFilterI, DictionaryOptionsI, DictionaryQueryParameterI, DictionaryService } from '../../../dictionary/dictionary.service';
import { ViewWidgetsDirective } from '../viewWidgetsDirective';


@Component({
    selector: 'dhpp-widget-cooccurrence',
    templateUrl: './cooccurrenceWidget.html',
    styleUrls: ['./cooccurrenceWidget.scss']
})
export class CooccurrenceWidgetComponent extends ViewWidgetsDirective<DictionaryQueryParameterI, DictionaryFilterI, DictionaryOptionsI, WordClass, DictionaryService> implements OnInit {
    cooccurrence: SenseClass[] = []
    limit: number
    offset: number
    public title: string = "Kookkurrenzen"
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
            this.isLoaded = Promise.resolve(true)                   
        }         
    }
    
    openHelp() {
        const dialogRef = this.help.open(CooccurrenceWidgetHelpComponent);
        dialogRef.afterClosed().subscribe(result => {
            console.log(`Dialog result: ${result}`);
        });
    }

}

@Component({
    selector: 'dhpp-widget-cooccurrence-help',
    templateUrl: './cooccurrenceWidgetHelp.html',
})
export class CooccurrenceWidgetHelpComponent { }