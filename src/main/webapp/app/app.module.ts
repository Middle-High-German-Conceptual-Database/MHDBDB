import {NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HashLocationStrategy, LocationStrategy} from '@angular/common';

import './vendor';
import {DhppbaseSharedModule} from 'app/shared/shared.module';
import {DhppbaseCoreModule} from 'app/core/core.module';
import {routes} from './app.routes';
import {DhppbaseEntityModule} from './entities/entity.module';
import {ErrorComponent} from './layouts/error/error.component';
import {ReactiveFormsModule, FormsModule} from '@angular/forms';

import {TreeModule} from 'angular-tree-component';
import {AppComponent} from "app/app.component";
import {AppHomeComponent} from "app/home/home.component";
import {DhppNavbarComponent} from "app/shared/navbar/navbar.component";
import {DhppFooterComponent} from "app/shared/footer/footer.component";
import {DhppHeaderComponent} from "app/shared/header/header.component";
import {ScrollToTopComponent} from "app/shared/scrolltotop/scroll-to-top.component";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {AppXSharedModule} from "app/app-shared.module";
import {MatTabsModule} from "@angular/material/tabs";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MHDBDBFormModule} from "app/shared/formComponents/formModule";
import {MHDBDBViewWidgetsModule} from "app/shared/viewWidgets/viewWidgetsModule";
import {MaterialModule} from "app/shared/MaterialModule";
import {RouterModule} from "@angular/router";
import {CustomReactComponentWrapperComponent} from "app/components/CustomReactComponentWrapper";

@NgModule({
  imports: [
    BrowserModule,
    DhppbaseSharedModule,
    DhppbaseCoreModule,
    DhppbaseEntityModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    AppXSharedModule,
    MatTabsModule,
    MatProgressSpinnerModule,
    MHDBDBFormModule,
    MHDBDBViewWidgetsModule,
    MaterialModule,
    RouterModule.forRoot(routes, {useHash: true, onSameUrlNavigation: 'reload'}),
    TreeModule.forRoot()
  ],
  exports: [
    MaterialModule
  ],
  declarations: [
    AppComponent,
    AppHomeComponent,
    ErrorComponent,
    DhppNavbarComponent,
    DhppFooterComponent,
    DhppHeaderComponent,
    ScrollToTopComponent,
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: []
})
export class DhppbaseAppModule {
}


