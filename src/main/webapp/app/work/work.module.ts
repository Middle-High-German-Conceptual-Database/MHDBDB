import { NgxSliderModule } from "@angular-slider/ngx-slider";
import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from "@angular/material/chips";
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { TagInputModule } from 'ngx-chips';
import { AppXSharedModule } from "../app-shared.module";
import { WorkViewComponent } from "./work-view/work-view.component";
import { WorkListComponent } from "./work-list/work-list.component";
import { WorkComponent } from './work.component';
import { workRoutes } from "./work.route";
import {MHDBDBFormModule} from "app/shared/formComponents/formModule";
import {ElementComponentModule} from "app/shared/elementComponent/elementComponentModule";
import {MHDBDBViewWidgetsModule} from "app/shared/viewWidgets/viewWidgetsModule";

const ENTITY_STATES = [...workRoutes];

@NgModule({
    declarations: [
        WorkComponent,
        WorkViewComponent,
        WorkListComponent
    ],
    entryComponents: [
        WorkComponent,
        WorkViewComponent,
        WorkListComponent
    ],
    imports: [MHDBDBFormModule, MatCheckboxModule, MatDialogModule, MatInputModule, MatListModule, MatSnackBarModule, MatProgressSpinnerModule, CommonModule, FormsModule, AppXSharedModule, ReactiveFormsModule, TagInputModule, MatSlideToggleModule, MatExpansionModule, MatButtonModule, MatToolbarModule, MatIconModule, NgxSliderModule, RouterModule.forChild(ENTITY_STATES), MatFormFieldModule, MatChipsModule, MatAutocompleteModule, ElementComponentModule, MHDBDBViewWidgetsModule],
    exports: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class WorkModule { }
