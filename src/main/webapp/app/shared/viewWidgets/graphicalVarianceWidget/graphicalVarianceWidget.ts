import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Sort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { WordClass, SenseClass } from '../../../dictionary/dictionary.class';
import { DictionaryFilterI, DictionaryOptionsI, DictionaryQueryParameterI, DictionaryService, graphicalForm } from '../../../dictionary/dictionary.service';
import { ViewWidgetsDirective } from '../viewWidgetsDirective';


@Component({
    selector: 'dhpp-widget-graphicalvariance',
    templateUrl: './graphicalVarianceWidget.html',
    styleUrls: ['./graphicalVarianceWidget.scss']
})
export class GraphicalVarianceWidgetComponent extends ViewWidgetsDirective<DictionaryQueryParameterI, DictionaryFilterI, DictionaryOptionsI, WordClass, DictionaryService> implements OnInit {
    public title="Graphische Varianz"
    public list: graphicalForm[]
    public sortedList: graphicalForm[]
    public displayedColumns: string[] = ['form', 'occurrences'];
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
            this.loadGraphicalVariance()
        }         
    }
    
    loadGraphicalVariance() {
        this.service.getGraphicalVariance(this.instance).then(
            data => {
                this.list = data
                this.sortedList = this.list.slice();
                this.isLoaded = Promise.resolve(true)
            }
        )
    }

    openHelp() {
        const dialogRef = this.help.open(GraphicalVarianceWidgetHelpComponent);
        dialogRef.afterClosed().subscribe(result => {
            console.log(`Dialog result: ${result}`);
        });
    }

    sortData(sort: Sort) {
        const data = this.list.slice();
        if (!sort.active || sort.direction === '') {
            this.list = data;
            return;
        }

        this.sortedList = data.sort((a, b) => {
            const isAsc = sort.direction === 'asc';
            switch (sort.active) {
                case 'form': return compare(a.form, b.form, isAsc);
                case 'occurrences': return compare(a.occurrences, b.occurrences, isAsc);                
                default: return 0;
            }
        });
    }

}

function compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}""

@Component({
    selector: 'dhpp-widget-graphicalVariance-help',
    templateUrl: './graphicalVarianceWidgetHelp.html',
})
export class GraphicalVarianceWidgetHelpComponent { }