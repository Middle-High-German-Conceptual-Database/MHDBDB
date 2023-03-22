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
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TagInputModule } from 'ngx-chips';
import { AppXSharedModule } from "../../app-shared.module";
import { PlaceListComponent } from "./place-list/place-list.component";
import { PlaceViewComponent } from "./place-view/place-view.component";
import { PlaceComponent } from './place.component';
import { placeRoutes } from "./place.route";
import {MHDBDBFormModule} from "app/shared/formComponents/formModule";
import {ElementComponentModule} from "app/shared/elementComponent/elementComponentModule";


const ENTITY_STATES = [...placeRoutes];

@NgModule({
    declarations: [PlaceComponent, PlaceViewComponent, PlaceListComponent],
    entryComponents: [PlaceComponent, PlaceViewComponent, PlaceListComponent],
    imports: [MHDBDBFormModule,MatProgressSpinnerModule, CommonModule, FormsModule, AppXSharedModule, ReactiveFormsModule, TagInputModule, MatSlideToggleModule, MatExpansionModule, MatButtonModule, MatToolbarModule, MatIconModule, FontAwesomeModule, RouterModule.forChild(ENTITY_STATES), MatFormFieldModule, MatChipsModule, MatAutocompleteModule, ElementComponentModule],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PlaceModule { }
