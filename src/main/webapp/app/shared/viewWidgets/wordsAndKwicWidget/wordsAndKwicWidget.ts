import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnChanges, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { ActivatedRoute, Router } from '@angular/router';
import { WordClass } from '../../../dictionary/dictionary.class';
import { DictionaryFilterI, DictionaryOptionsI, DictionaryQueryParameterI, DictionaryService } from '../../../dictionary/dictionary.service';
import { TextService } from '../../../text/text.service';
import { ViewWidgetsDirective } from '../viewWidgetsDirective';
import { Concept } from './../../../concept/concept.class';


@Component({
    selector: 'dhpp-widget-wordsAndkwic',
    templateUrl: './wordsAndKwicWidget.html',
    styleUrls: ['./wordsAndKwicWidget.scss']
})
export class WordsAndKwicWidgetComponent extends ViewWidgetsDirective<DictionaryQueryParameterI, DictionaryFilterI, DictionaryOptionsI, Concept, DictionaryService> implements OnInit, OnChanges {
    title: string;
    total: number
    words: WordClass[]
    includeNarrowerConcepts = false
    pageEvent: PageEvent;

    constructor(
        public service: DictionaryService,
        public help: MatDialog,
        public router: Router,
        public route: ActivatedRoute,
        public locationService: Location,
        public http: HttpClient,
        public textService: TextService
    ) {
        super(service, help)
        this.title= "Lemmata"
    }

    ngOnInit() {
        super.ngOnInit()
    }

    ngOnChanges() {
        this.first()
    }

    first() {
        this.isLoaded = Promise.resolve(false)
        this.words = undefined
        this.total = undefined
        if (this.instance) {
            this.service.getWordsByConcepts(this.instance, this.includeNarrowerConcepts, this.limit, this.offset).then(
                data => {
                    this.words = data[0]
                    this.total = data[1]
                    this.isLoaded = Promise.resolve(true)
                }
            )
        }
    }

    next() {
        if (this.instance) {
            this.service.getWordsByConcepts(this.instance, this.includeNarrowerConcepts, this.limit, this.offset).then(
                data => {
                    this.words = data[0]
                }
            )
        }
    }

    openHelp() {
        const dialogRef = this.help.open(WordsAndKwicWidgetHelpComponent);
        dialogRef.afterClosed().subscribe(result => {
            console.log(`Dialog result: ${result}`);
        });
    }

    toggleNarrower(event: MatSlideToggleChange) {
        this.includeNarrowerConcepts = event.checked;
        this.first()
    }

    pageEventTrigger(event: PageEvent) {
        this.offset= event.pageIndex * this.limit
        this.next()
    }

}

@Component({
    selector: 'dhpp-widget-wordsAndkwic-help',
    templateUrl: './wordsAndKwicWidgetHelp.html',
})
export class WordsAndKwicWidgetHelpComponent { }
