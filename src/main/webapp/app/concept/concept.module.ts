import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from "@angular/material/chips";
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTreeModule } from "@angular/material/tree";
import { MatSelectModule } from '@angular/material/select';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TagInputModule } from 'ngx-chips';
import { AppXSharedModule } from "../app-shared.module";
import { ConceptComponent } from './concept.component';
import { conceptRoutes } from "./concept.route";
import { ConceptListComponent } from "./concept-list/list.component";
import { ConceptViewComponent } from "./concept-view/concept-view.component";
import { ConceptTreeComponent } from './concept-tree/concept-tree.component';
import {MHDBDBViewWidgetsModule} from "app/shared/viewWidgets/viewWidgetsModule";
import {ElementComponentModule} from "app/shared/elementComponent/elementComponentModule";


const ENTITY_STATES = [...conceptRoutes];

@NgModule({
    declarations: [
        ConceptComponent,
        ConceptViewComponent,
        ConceptListComponent,
        ConceptTreeComponent
    ],
    entryComponents: [
        ConceptComponent,
        ConceptViewComponent,
        ConceptListComponent,
        ConceptTreeComponent
    ],
    imports: [MHDBDBViewWidgetsModule, CommonModule, FormsModule, AppXSharedModule, ReactiveFormsModule, TagInputModule, MatInputModule, MatListModule, MatTabsModule, MatSlideToggleModule, MatExpansionModule, MatButtonModule, MatToolbarModule, MatProgressBarModule, MatIconModule, FontAwesomeModule, RouterModule.forChild(ENTITY_STATES), MatFormFieldModule, MatChipsModule, MatAutocompleteModule, MatTreeModule, MatSelectModule, ScrollingModule, ElementComponentModule],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ConceptModule { }
