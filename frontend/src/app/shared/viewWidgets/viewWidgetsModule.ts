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
import { CooccurrenceWidgetComponent, CooccurrenceWidgetHelpComponent } from './cooccurrenceWidget/cooccurrenceWidget';
import { GraphicalVarianceWidgetComponent, GraphicalVarianceWidgetHelpComponent } from './graphicalVarianceWidget/graphicalVarianceWidget';
import { KwicWidgetComponent, KwicWidgetHelpComponent } from './kwicWidget/kwicWidget';
import { SensesWidgetComponent, SensesWidgetHelpComponent } from './sensesWidget/sensesWidget';
import { WordFormationWidgetComponent, WordFormationWidgetHelpComponent } from './wordFormationWidget/wordFormationWidget';
import { WordsAndKwicWidgetComponent, WordsAndKwicWidgetHelpComponent } from './wordsAndKwicWidget/wordsAndKwicWidget';
import { TextPassageWidgetComponent, TextPassageWidgetHelpComponent } from './textPassageWidget/textPassageWidget';
import { ExpansionPanelWrapperComponent } from './expansionPanelWrapper/expansionPanelWrapper';
import { WorkWidgetComponent, WorkWidgetHelpComponent } from 'app/shared/viewWidgets/workWidget/workWidget';
import {
  WorkInstancesWidgetComponent,
  WorkInstancesWidgetHelpComponent
} from 'app/shared/viewWidgets/workInstancesWidget/workInstancesWidget';
import { WorkLodWidgetComponent, WorkLodWidgetHelpComponent } from 'app/shared/viewWidgets/workLodWidget/workLodWidget';
import { WorkBibWidgetComponent, WorkBibWidgetHelpComponent } from 'app/shared/viewWidgets/workBibWidget/workBibWidget';

@NgModule({
  entryComponents: [
    WordFormationWidgetComponent,
    WordFormationWidgetHelpComponent,
    SensesWidgetComponent,
    SensesWidgetHelpComponent,
    CooccurrenceWidgetComponent,
    CooccurrenceWidgetHelpComponent,
    KwicWidgetComponent,
    KwicWidgetHelpComponent,
    GraphicalVarianceWidgetComponent,
    GraphicalVarianceWidgetHelpComponent,
    WordsAndKwicWidgetComponent,
    WordsAndKwicWidgetHelpComponent,
    TextPassageWidgetComponent,
    TextPassageWidgetHelpComponent,
    ExpansionPanelWrapperComponent,
    WorkWidgetComponent,
    WorkWidgetHelpComponent,
    WorkInstancesWidgetComponent,
    WorkInstancesWidgetHelpComponent,
    WorkLodWidgetComponent,
    WorkLodWidgetHelpComponent,
    WorkBibWidgetComponent,
    WorkBibWidgetHelpComponent
  ],
  declarations: [
    WordFormationWidgetComponent,
    WordFormationWidgetHelpComponent,
    SensesWidgetComponent,
    SensesWidgetHelpComponent,
    CooccurrenceWidgetComponent,
    CooccurrenceWidgetHelpComponent,
    KwicWidgetComponent,
    KwicWidgetHelpComponent,
    GraphicalVarianceWidgetComponent,
    GraphicalVarianceWidgetHelpComponent,
    WordsAndKwicWidgetComponent,
    WordsAndKwicWidgetHelpComponent,
    TextPassageWidgetComponent,
    TextPassageWidgetHelpComponent,
    ExpansionPanelWrapperComponent,
    WorkWidgetComponent,
    WorkWidgetHelpComponent,
    WorkInstancesWidgetComponent,
    WorkInstancesWidgetHelpComponent,
    WorkLodWidgetComponent,
    WorkLodWidgetHelpComponent,
    WorkBibWidgetComponent,
    WorkBibWidgetHelpComponent
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
    MatSortModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [
    WordFormationWidgetComponent,
    SensesWidgetComponent,
    CooccurrenceWidgetComponent,
    KwicWidgetComponent,
    GraphicalVarianceWidgetComponent,
    WordsAndKwicWidgetComponent,
    TextPassageWidgetComponent,
    WorkWidgetComponent,
    WorkInstancesWidgetComponent,
    WorkBibWidgetComponent,
    WorkLodWidgetComponent
  ]
})
export class MHDBDBViewWidgetsModule {}
