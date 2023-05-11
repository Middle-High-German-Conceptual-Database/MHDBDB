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
import { RouterModule } from '@angular/router';
import { TagInputModule } from 'ngx-chips';
import { AppXSharedModule } from "../app-shared.module";
import { OnomasticsComponent } from './onomastics.component';
import { onomasticsRoutes } from "./onomastics.route";
import { OnomasticsViewComponent } from "./onomastics-view/onomastics-view.component";
import { OnomasticsTreeComponent } from './onomastics-tree/onomastics-tree.component';
import {ElementComponentModule} from "app/shared/elementComponent/elementComponentModule";


const ENTITY_STATES = [...onomasticsRoutes];

@NgModule({
    declarations: [
        OnomasticsComponent,
        OnomasticsViewComponent,
        OnomasticsTreeComponent
    ],
    entryComponents: [
        OnomasticsComponent,
        OnomasticsViewComponent,
        OnomasticsTreeComponent
    ],
    imports: [CommonModule, FormsModule, AppXSharedModule, ReactiveFormsModule, TagInputModule, MatInputModule, MatListModule, MatTabsModule, MatSlideToggleModule, MatExpansionModule, MatButtonModule, MatToolbarModule, MatProgressBarModule, MatIconModule, RouterModule.forChild(ENTITY_STATES), MatFormFieldModule, MatChipsModule, MatAutocompleteModule, MatTreeModule, ElementComponentModule],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class OnomasticsModule { }
