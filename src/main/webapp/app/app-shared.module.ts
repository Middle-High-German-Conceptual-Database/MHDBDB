import {CommonModule} from "@angular/common";
import {NgModule} from '@angular/core';
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatButtonModule} from '@angular/material/button';
import {MatChipsModule} from "@angular/material/chips";
import {MatExpansionModule} from '@angular/material/expansion';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIconModule} from '@angular/material/icon';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatTabsModule} from '@angular/material/tabs';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatTreeModule} from '@angular/material/tree';
import {RdfInstancePipe, SeealsoPipe, ToggleNavbarComponent} from 'app/shared/base.imports';
import {InfiniteScrollModule} from 'ngx-infinite-scroll';
import {ExcerptPipe} from "./excerpt.pipe";
import {SafeHtmlPipe} from "./safehtml.pipe";
import {TextIdPipe} from "./textid.pipe";
import {NiceInstanceNamePipe} from "./niceinstancename.pipe";



@NgModule({
  declarations: [
    ToggleNavbarComponent,
    RdfInstancePipe,
    SeealsoPipe,
    SafeHtmlPipe,
    TextIdPipe,
    ExcerptPipe,
    NiceInstanceNamePipe,
  ],
  imports: [
    CommonModule,
    MatSlideToggleModule,
    MatExpansionModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatFormFieldModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatTabsModule,
    MatTreeModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    InfiniteScrollModule,
  ],
  exports: [
    ToggleNavbarComponent,
    RdfInstancePipe,
    SeealsoPipe,
    SafeHtmlPipe,
    TextIdPipe,
    ExcerptPipe,
    NiceInstanceNamePipe,
    InfiniteScrollModule
  ]
})
export class AppXSharedModule {
}
