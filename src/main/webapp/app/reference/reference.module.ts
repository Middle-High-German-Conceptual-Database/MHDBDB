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
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TagInputModule } from 'ngx-chips';
import { AppXSharedModule } from "../app-shared.module";
import { TextListComponent } from "./reference-list/reference-list.component";
import { TextComponent } from './reference.component';
import { textRoutes } from './reference.route';
import { MatCardModule } from '@angular/material/card';
import {MatTabsModule} from "@angular/material/tabs";
import {MatRadioModule} from "@angular/material/radio";
import {MHDBDBViewWidgetsModule} from "app/shared/viewWidgets/viewWidgetsModule";
import {MHDBDBFormModule} from "app/shared/formComponents/formModule";

const ENTITY_STATES = [...textRoutes];

@NgModule({
    declarations: [
        TextComponent,
        TextListComponent
    ],
    entryComponents: [
        TextComponent,
        TextListComponent
    ],
    imports: [MHDBDBViewWidgetsModule, MHDBDBFormModule, MatCardModule, MHDBDBFormModule, CommonModule, AppXSharedModule, FormsModule, ReactiveFormsModule, TagInputModule, FontAwesomeModule, NgxSliderModule, MatSnackBarModule, MatDialogModule, MatFormFieldModule, MatCheckboxModule, MatFormFieldModule, MatChipsModule, MatAutocompleteModule, MatListModule, MatInputModule, MatSlideToggleModule, MatExpansionModule, MatButtonModule, MatToolbarModule, MatIconModule, MatProgressSpinnerModule, RouterModule.forChild(ENTITY_STATES), MatTabsModule, MatRadioModule],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    exports: []
})
export class ReferenceModule { }
