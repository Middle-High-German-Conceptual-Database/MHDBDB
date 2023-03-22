import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Directive, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FilterIdI, MhdbdbIdLabelEntityService, OptionsI, QueryParameterI } from '../../mhdbdb-graph.service';
import { MhdbdbIdLabelEntity } from "../baseindexcomponent.class";

@Directive()
export abstract class BaseIndexElementDirective<c extends MhdbdbIdLabelEntity, qT extends QueryParameterI<f, o>, f extends FilterIdI, o extends OptionsI> implements OnInit {
    @Input() instance?: c;
    @Input() id?: string;
    isLoaded = false;

    constructor(
        public router: Router,
        public route: ActivatedRoute,
        public locationService: Location,
        public http: HttpClient,
        public service: MhdbdbIdLabelEntityService<qT, f, o, c>
    ) {
    }

    ngOnInit(): void {       
        if (this.id && !this.instance) {            
            let qp:qT = this.service.defaultQp
            qp.filter.id= this.id
            this.service.getInstance(qp).then(
                data => {
                    this.instance= data as c
                    this.isLoaded = true                    
                }
            )
        } else {
            this.isLoaded= true
        }

    }
}
