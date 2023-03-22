import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from "@angular/material/chips";
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input'
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { AppXSharedModule } from "../../app-shared.module";
import { FormConceptsComponent, FormConceptsHelpComponent } from './formConcepts/formConcepts';
import { FormFooterComponent } from './formFooter/formFooter';
import { FormHeaderComponent } from './formHeader/formHeader';
import { FormPosCheckboxesComponent, FormPosCheckboxesHelpComponent } from './formPosCheckboxes/formPosCheckboxes';
import { FormTextSearchComponent, FormTextSearchHelpComponent } from './formTextSearch/formTextSearch';
import { FormTokenContextComponent, FormTokenContextHelpComponent } from './formTokenContext/formTokenContext'
import { FormTokenComponent, FormTokenHelpComponent, FormTokenConceptsComponent, FormTokenPosComponent, FormTokenWordComponent, tokenFormService } from './formToken/formToken'
import { FormClassCheckboxesComponent, FormClassCheckboxesHelpComponent } from './formClassCheckboxes/formClassCheckboxes'
@NgModule({
    entryComponents: [
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
    ],
    declarations: [
        FormTextSearchComponent,
        FormTextSearchHelpComponent,
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
        MatSlideToggleModule
    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA
    ],
    exports: [
        FormTextSearchComponent,
        FormPosCheckboxesComponent,
        FormConceptsComponent,
        FormHeaderComponent,
        FormFooterComponent,
        FormTokenComponent,
        FormTokenContextComponent,
        FormClassCheckboxesComponent,
        FormTokenConceptsComponent
    ]
})
export class MHDBDBFormModule { }
