import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { AppXSharedModule } from '../app-shared.module';
import { DictionaryListComponent } from './dictionary-list/dictionary-list.component';
import { DictionaryViewComponent } from './dictionary-view/dictionary-view.component';
import { DictionaryComponent } from './dictionary.component';
import { dictionaryRoutes } from './dictionary.route';
import { DictionaryEditComponent } from './edit/edit.component';
import { MHDBDBFormModule } from 'app/shared/formComponents/formModule';
import { MHDBDBViewWidgetsModule } from 'app/shared/viewWidgets/viewWidgetsModule';
import { ElementComponentModule } from 'app/shared/elementComponent/elementComponentModule';

const ENTITY_STATES = [...dictionaryRoutes];

@NgModule({
  declarations: [DictionaryComponent, DictionaryListComponent, DictionaryEditComponent, DictionaryViewComponent],
  entryComponents: [DictionaryComponent],
  imports: [
    MHDBDBFormModule,
    MHDBDBViewWidgetsModule,
    MatCardModule,
    MatGridListModule,
    CommonModule,
    AppXSharedModule,
    FormsModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatDialogModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatListModule,
    MatInputModule,
    MatSlideToggleModule,
    MatExpansionModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatProgressSpinnerModule,
    RouterModule.forChild(ENTITY_STATES),
    ElementComponentModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DictionaryModule {}
