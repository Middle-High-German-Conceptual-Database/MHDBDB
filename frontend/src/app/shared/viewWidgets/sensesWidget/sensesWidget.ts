import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { WordClass, SenseClass } from '../../../dictionary/dictionary.class';
import { DictionaryFilterI, DictionaryOptionsI, DictionaryQueryParameterI, DictionaryService } from '../../../dictionary/dictionary.service';
import { ViewWidgetsDirective } from '../viewWidgetsDirective';
import { ActivatedRoute, Router } from '@angular/router';
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';


@Component({
    selector: 'dhpp-widget-senses',
    templateUrl: './sensesWidget.html',
    styleUrls: ['./sensesWidget.scss']
})
export class SensesWidgetComponent extends ViewWidgetsDirective<DictionaryQueryParameterI, DictionaryFilterI, DictionaryOptionsI, WordClass, DictionaryService> implements OnInit {
    senses: SenseClass[] = []
    public title: string ="Wortbedeutungen"
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
        this.loadSenses()         
    }

    loadSenses() {
        if (this.instance) {
            this.service.getSenses(this.instance).then( data => {
                this.senses = data
                this.total = data.length
                this.isLoaded = Promise.resolve(true)
            })            
        } 
    }
    
    openHelp() {
        const dialogRef = this.help.open(SensesWidgetHelpComponent);
        dialogRef.afterClosed().subscribe(result => {
            console.log(`Dialog result: ${result}`);
        });
    }

}

@Component({
    selector: 'dhpp-widget-senses-help',
    templateUrl: './sensesWidgetHelp.html',
})
export class SensesWidgetHelpComponent { }