import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { AppXSharedModule } from '../../app-shared.module';
import { PersonListComponent } from './person-list/person-list.component';
import { PersonViewComponent } from './person-view/person-view.component';
import { PersonComponent } from './person.component';
import { personRoutes } from './person.route';
import { MHDBDBFormModule } from '../../shared/formComponents/formModule';
import { ElementComponentModule } from '../../shared/elementComponent/elementComponentModule';

const ENTITY_STATES = [...personRoutes];

@NgModule({
  declarations: [PersonComponent, PersonViewComponent, PersonListComponent],
  entryComponents: [PersonComponent, PersonViewComponent, PersonListComponent],
  imports: [
    MHDBDBFormModule,
    MatProgressSpinnerModule,
    CommonModule,
    FormsModule,
    AppXSharedModule,
    ReactiveFormsModule,
    MatSlideToggleModule,
    MatExpansionModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    RouterModule.forChild(ENTITY_STATES),
    MatFormFieldModule,
    MatChipsModule,
    MatAutocompleteModule,
    ElementComponentModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PersonModule {}
