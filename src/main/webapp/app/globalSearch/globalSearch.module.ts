import { NgxSliderModule } from "@angular-slider/ngx-slider";
import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from "@angular/material/chips";
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { TagInputModule } from 'ngx-chips';
import { AppXSharedModule } from "../app-shared.module";
import { GlobalSearchListComponent } from './globalSearch-list/globalSearch-list.component';
import { GlobalSearchComponent } from './globalSearch.component';
import { globalSearchRoutes } from './globalSearch.route';
import {MHDBDBFormModule} from "app/shared/formComponents/formModule";
import {ElementComponentModule} from "app/shared/elementComponent/elementComponentModule";
const ENTITY_STATES = [...globalSearchRoutes];

@NgModule({
    declarations: [
        GlobalSearchComponent,
        GlobalSearchListComponent,

    ],
    entryComponents: [
        GlobalSearchComponent,
        GlobalSearchListComponent
    ],
    imports: [
        MHDBDBFormModule,
        MatProgressSpinnerModule,
        CommonModule,
        FormsModule,
        AppXSharedModule,
        ReactiveFormsModule,
        TagInputModule,
        MatSlideToggleModule,
        MatExpansionModule,
        MatButtonModule,
        MatToolbarModule,
        MatIconModule,
        NgxSliderModule,
        RouterModule.forChild(ENTITY_STATES),
        MatFormFieldModule,
        MatChipsModule,
        MatAutocompleteModule,
        ElementComponentModule
    ],
    exports: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class GlobalSearchModule { }
