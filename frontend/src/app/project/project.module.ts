import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// Material Components

import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatExpansionModule } from '@angular/material/expansion';

import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { projectRoutes } from './project.route';
import { AppXSharedModule } from '../app-shared.module';
import { ProjectComponent } from './project.component';

const ENTITY_STATES = [...projectRoutes];

@NgModule({
  declarations: [ProjectComponent],
  entryComponents: [ProjectComponent],
  imports: [
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
    MatAutocompleteModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ProjectModule {}
