import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { MhdbdbIdEntity, IdLabelI } from '../../baseIndexComponent/baseindexcomponent.class';
import { Kwic, Token } from '../../../text/text.class';
import { TextService } from '../../../text/text.service';
import { ViewWidgetsDirective } from '../viewWidgetsDirective';
import {WorkFilterI, WorkOptionsI, WorkQueryParameterI, WorkService} from "app/work/work.service";

@Component({
    selector: 'dhpp-widget-work-bib',
    templateUrl: './workBibWidget.html',
    styleUrls: ['./workBibWidget.scss']
})
export class WorkBibWidgetComponent extends ViewWidgetsDirective<WorkQueryParameterI, WorkFilterI, WorkOptionsI, MhdbdbIdEntity, WorkService> implements OnInit {
    total: number
    kwics: Kwic[] = []
    public title: string = "Bibliographische Metadaten"
    punctuationRegexp = new RegExp('^[^\w\s]$')

    constructor(
        public service: WorkService,
        public help: MatDialog,
        public router: Router,
        public route: ActivatedRoute,
        public locationService: Location,
        public http: HttpClient,
        public textService: TextService
    ) {
        super(service, help)
    }

    ngOnInit(): void {
        super.ngOnInit()
        if (this.instance) {
            this.loadOccurrences()
            this.isLoaded = Promise.resolve(true)
        }
    }

    openHelp() {
        const dialogRef = this.help.open(WorkBibWidgetHelpComponent);
        dialogRef.afterClosed().subscribe(result => {
            console.log(`Dialog result: ${result}`);
        });
    }

    joinTokens(tokens:Token[]) {
        let stringList:string[]= []
        tokens.forEach(
            token => stringList.push(this.punctuationRegexp.test(token.content) ? token.content.trim() : " " + token.content.trim())
        )
        return stringList.join('')
    }

    public loadOccurrences() {
        this.textService.getAnnotations(this.limit, this.offset, this.instance.id, undefined, "tei:seg")
            .then(annotations => {
                this.isLoaded = Promise.resolve(true)
                this.total = annotations[1]
                if (annotations[1] > 0)
                {
                    annotations[0].forEach(
                        annotation => {
                            this.textService.getKwic(annotation.target).then(
                                kwic => {
                                    if (kwic) {
                                        this.kwics.push(kwic)
                                    }
                                }
                            )
                        })
                }
                else {
                    this.kwics = []
                }

            })
            .catch(error => {
                // console.warn(error)
            })
    }

    public moreOccurrences() {
        this.offset = this.offset + this.limit
        this.loadOccurrences()
    }

}

@Component({
    selector: 'dhpp-widget-work-bib-help',
    templateUrl: './workBibWidgetHelp.html',
})
export class WorkBibWidgetHelpComponent { }
