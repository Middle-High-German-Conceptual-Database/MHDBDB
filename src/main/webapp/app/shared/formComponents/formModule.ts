import {CommonModule} from '@angular/common';
import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatChipsModule} from "@angular/material/chips";
import {MatDialogModule} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input'
import {MatRadioModule} from '@angular/material/radio';
import {MatSelectModule} from '@angular/material/select';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {AppXSharedModule} from "../../app-shared.module";
import {FormConceptsComponent, FormConceptsHelpComponent} from './formConcepts/formConcepts';
import {FormFooterComponent} from './formFooter/formFooter';
import {FormHeaderComponent} from './formHeader/formHeader';
import {FormPosCheckboxesComponent, FormPosCheckboxesHelpComponent} from './formPosCheckboxes/formPosCheckboxes';
import {FormTextSearchComponent, FormTextSearchHelpComponent} from './formTextSearch/formTextSearch';
import {FormTokenContextComponent, FormTokenContextHelpComponent} from './formTokenContext/formTokenContext'
import {
  FormTokenComponent,
  FormTokenHelpComponent,
  FormTokenConceptsComponent,
  FormTokenPosComponent,
  FormTokenWordComponent,
  tokenFormService
} from './formToken/formToken'
import {FormClassCheckboxesComponent, FormClassCheckboxesHelpComponent} from './formClassCheckboxes/formClassCheckboxes'
import {
  FormWorkSearchComponent,
  FormWorkSearchHelpComponent
} from "app/shared/formComponents/formWorkSearch/formWorkSearch";
import {
  FormLemmaSearchComponent,
  FormLemmaSearchHelpComponent
} from "app/shared/formComponents/formLemmaSearch/formLemmaSearch";
import {FormAuthorComponent, FormAuthorHelpComponent} from "app/shared/formComponents/formAuthor/formAuthor";
import {NgxSliderModule} from "@angular-slider/ngx-slider";
import {FormFilterComponent, FormFilterHelpComponent} from "app/shared/formComponents/formFilter/formFilter";
import {MatTreeModule} from '@angular/material/tree';
import {CustomReactComponentWrapperComponent} from "app/components/CustomReactComponentWrapper";
import {ReactWrapperComponent} from "app/components/ReactWrapperComponent";

@NgModule({
  entryComponents: [
    FormLemmaSearchComponent,
    FormLemmaSearchHelpComponent,
    FormWorkSearchComponent,
    FormWorkSearchHelpComponent,
    FormTextSearchComponent,
    FormTextSearchHelpComponent,
    FormPosCheckboxesComponent,
    FormPosCheckboxesHelpComponent,
    FormConceptsComponent,
    FormConceptsHelpComponent,
    FormTokenComponent,
    FormTokenHelpComponent,
    FormTokenContextComponent,
    FormTokenContextHelpComponent,
    FormClassCheckboxesComponent,
    FormClassCheckboxesHelpComponent,
    FormHeaderComponent,
    FormFooterComponent,
    FormAuthorComponent,
    FormAuthorHelpComponent,
    FormFilterComponent,
    FormFilterHelpComponent,
    CustomReactComponentWrapperComponent,
    ReactWrapperComponent
  ],
  declarations: [
    FormLemmaSearchComponent,
    FormLemmaSearchHelpComponent,
    FormTextSearchComponent,
    FormTextSearchHelpComponent,
    FormWorkSearchComponent,
    FormWorkSearchHelpComponent,
    FormPosCheckboxesComponent,
    FormPosCheckboxesHelpComponent,
    FormConceptsComponent,
    FormConceptsHelpComponent,
    FormHeaderComponent,
    FormFooterComponent,
    FormTokenComponent,
    FormTokenHelpComponent,
    FormTokenConceptsComponent,
    FormTokenPosComponent,
    FormTokenWordComponent,
    FormTokenContextComponent,
    FormTokenContextHelpComponent,
    FormClassCheckboxesComponent,
    FormClassCheckboxesHelpComponent,
    FormAuthorComponent,
    FormAuthorHelpComponent,
    FormFilterComponent,
    FormFilterHelpComponent,
    CustomReactComponentWrapperComponent,
    ReactWrapperComponent
  ],
  imports: [
    AppXSharedModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatRadioModule,
    MatSelectModule,
    MatSlideToggleModule,
    NgxSliderModule,
    MatTreeModule,
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  exports: [
    FormLemmaSearchComponent,
    FormWorkSearchComponent,
    FormTextSearchComponent,
    FormPosCheckboxesComponent,
    FormConceptsComponent,
    FormHeaderComponent,
    FormFooterComponent,
    FormTokenComponent,
    FormTokenContextComponent,
    FormClassCheckboxesComponent,
    FormTokenConceptsComponent,
    FormAuthorComponent,
    FormFilterComponent,
    CustomReactComponentWrapperComponent,
    ReactWrapperComponent
  ]
})
export class MHDBDBFormModule {
}
