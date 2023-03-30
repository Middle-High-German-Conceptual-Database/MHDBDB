import { Directive, Input, OnInit } from "@angular/core";
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject } from "rxjs";
import { MhdbdbIdEntity, MhdbdbEntity } from "../baseIndexComponent/baseindexcomponent.class";
import { FilterIdI, FilterI, MhdbdbGraphService, OptionsI, QueryParameterI } from '../mhdbdb-graph.service';

@Directive()
export abstract class ViewWidgetsDirective<qT extends QueryParameterI<f, o>, f extends FilterI, o extends OptionsI, c extends MhdbdbEntity, s extends MhdbdbGraphService<qT,f,o,c>> implements OnInit {
    @Input() instance: c;
    @Input() asPanel: boolean = true
    @Input() limit: number = 10
    @Input() offset: number = 0
    total: number = 0
    abstract title: string
    openHelpSubject: BehaviorSubject<boolean>= new BehaviorSubject<boolean>(false);
    public isLoaded: Promise<boolean> = Promise.resolve(false);
    constructor(
        public service: s,
        public help: MatDialog,
    ) {
    }

    ngOnInit() {
        this.openHelpSubject.asObservable().subscribe(
            value => {
                if (this.openHelpSubject.getValue() == true) {
                    this.openHelp()
                    this.openHelpSubject.next(false)
                }
            }
        )
    }

    abstract openHelp();
}
