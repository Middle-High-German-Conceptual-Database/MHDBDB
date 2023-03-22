import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WordClass } from "../../../dictionary/dictionary.class";
import { DictionaryFilterI, DictionaryOptionsI, DictionaryQueryParameterI, DictionaryService } from '../../../dictionary/dictionary.service';
import { BaseIndexElementDirective } from '../../baseIndexComponent/element/element.component';

@Component({
    selector: 'dhpp-dictionary-element',
    templateUrl: './dictionary-element.component.html',
    styleUrls: ['dictionary-element.component.scss']
})
export class DictionaryElementComponent extends BaseIndexElementDirective<WordClass, DictionaryQueryParameterI, DictionaryFilterI, DictionaryOptionsI> {
    @Input() instance: WordClass;
    constructor(
        public router: Router,
        public route: ActivatedRoute,
        public locationService: Location,
        public http: HttpClient,
        public service: DictionaryService
    ) {
        super(router, route, locationService, http, service)
    }
}
