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
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { AppXSharedModule } from '../../app-shared.module';
import { PersonElementComponent } from './person-element/person-element.component';
import { PlaceElementComponent } from './place-element/place-element.component';
import { WorkElementComponent } from './work-element/work-element.component';
import { DictionaryElementComponent } from './dictionary-element/dictionary-element.component';
import { ConceptElementComponent } from './concept-element/concept-element.component';
import { OnomasticsElementComponent } from './onomastics-element/onomastics-element.component';
import { TextElementComponent } from 'app/shared/elementComponent/text-element/text-element.component';
import { MHDBDBViewWidgetsModule } from 'app/shared/viewWidgets/viewWidgetsModule';
import { FixedFormFooterComponent } from 'app/shared/fixedFormFooter/fixed-form-footer.component';
import { MHDBDBFormModule } from 'app/shared/formComponents/formModule';

@NgModule({
  entryComponents: [
    PersonElementComponent,
    PlaceElementComponent,
    WorkElementComponent,
    DictionaryElementComponent,
    ConceptElementComponent,
    OnomasticsElementComponent,
    TextElementComponent
  ],
  declarations: [
    PersonElementComponent,
    PlaceElementComponent,
    WorkElementComponent,
    DictionaryElementComponent,
    ConceptElementComponent,
    OnomasticsElementComponent,
    TextElementComponent
  ],
  imports: [
    RouterModule,
    AppXSharedModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatExpansionModule,
    MatGridListModule,
    MatCardModule,
    MatSlideToggleModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatTableModule,
    MatSortModule,
    MHDBDBViewWidgetsModule,
    MHDBDBFormModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [
    PersonElementComponent,
    PlaceElementComponent,
    WorkElementComponent,
    DictionaryElementComponent,
    ConceptElementComponent,
    OnomasticsElementComponent,
    TextElementComponent
  ]
})
export class ElementComponentModule {}
