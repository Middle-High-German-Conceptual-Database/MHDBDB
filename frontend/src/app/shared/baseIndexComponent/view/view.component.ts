/* eslint-disable no-console */
import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Directive, Input, OnChanges, OnInit } from '@angular/core';
import { FormBuilder } from "@angular/forms";
import { MatAccordion } from '@angular/material/expansion';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { FilterIdI, MhdbdbGraphService, OptionsI, QueryParameterI } from '../../mhdbdb-graph.service';
import type { MhdbdbIdLabelEntity, IdLabelI } from '../baseindexcomponent.class';
import { NAMESPACE_MHDBDBI } from 'app/app.constants';

@Directive()
export abstract class BaseIndexViewDirective<qT extends QueryParameterI<f, o>, f extends FilterIdI, o extends OptionsI, c extends MhdbdbIdLabelEntity> implements OnChanges, OnInit  {    
    public editMode: Boolean = false;
    public isLoaded: Promise<boolean>;
    
    protected _instance: c ;
    
    @Input() set instance(value: c) {
        this._instance = value;          
        this.isLoaded = Promise.resolve(true)
    }
    
    get instance(): c {return this._instance}
    
    @Input() set id(value: string) {
        this.qp.filter.id = value;
        this.service.getInstance(this.qp)
            .then(data => {
                this.instance = data as c                            
            })
    }
    get id():string {
        return this.instance.id
    }

    @Input() set strippedId(value: string) {
        this.id = this.instanceNamespace + value;        
    }
    get strippedId(): string {
        return this.instance.strippedId
    }    

    protected qp: qT;
    protected defaultFilter: f;    
    protected defaultOptions: o; 
    
    public instanceNamespace= NAMESPACE_MHDBDBI
    
    abstract Accordion: MatAccordion;
    
    constructor(
        public router: Router,
        public route: ActivatedRoute,
        public locationService: Location,
        public http: HttpClient,
        public fb: FormBuilder,
        public service: MhdbdbGraphService<qT, f, o, c>
    ) {
        this.router.events.subscribe((e: any) => {            
            if (e instanceof NavigationEnd) {
                this.loadInstance();
            }
        });
    }

    ngOnInit() {

    }

    ngOnChanges() {    
        this.loadInstance()                              
    }

    loadInstance() {
        this.qp = JSON.parse(JSON.stringify(this.service.defaultQp))
        this.qp.filter = JSON.parse(JSON.stringify(this.service.defaultQp.filter))
        this.qp.option = JSON.parse(JSON.stringify(this.service.defaultQp.option))
        this.qp.limit = 1
        this.qp.offset = 0
        if ('id' in this.route.snapshot.params && this.route.snapshot.params['id']) {
            this.strippedId = this.route.snapshot.params['id']
        }
    }

    previousPage() {
        this.locationService.back();
    }

    closeAllPanels() {
        this.Accordion.closeAll();
    }
    openAllPanels() {
        this.Accordion.openAll();
    }
}
