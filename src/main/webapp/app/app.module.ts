import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import './vendor';
import { DhppbaseSharedModule } from 'app/shared/shared.module';
import { DhppbaseCoreModule } from 'app/core/core.module';
import { routes } from './app.routes';
import { DhppbaseEntityModule } from './entities/entity.module';
import { ErrorComponent } from './layouts/error/error.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { TreeModule } from 'angular-tree-component';
import { AppComponent } from 'app/app.component';
import { AppHomeComponent } from 'app/home/home.component';
import { DhppNavbarComponent } from 'app/shared/navbar/navbar.component';
import { DhppFooterComponent } from 'app/shared/footer/footer.component';
import { DhppHeaderComponent } from 'app/shared/header/header.component';
import { ScrollToTopComponent } from 'app/shared/scrolltotop/scroll-to-top.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppXSharedModule } from 'app/app-shared.module';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MHDBDBFormModule } from 'app/shared/formComponents/formModule';
import { MHDBDBViewWidgetsModule } from 'app/shared/viewWidgets/viewWidgetsModule';
import { MaterialModule } from 'app/shared/MaterialModule';
import { RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { filterReducer } from './store/filter.reducer';
import { generalFilterReducer } from './store/general-filter.reducer';
import { languageReducer } from './store/language.reducer';
import { uiReducer } from './store/ui.reducer';
import { DialogComponent } from './shared/dhpp-help-dialog.component';

import { MarkdownModule } from 'ngx-markdown';
import { HttpClientModule } from '@angular/common/http';

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
    AppXSharedModule,
    MatTabsModule,
    MatProgressSpinnerModule,
    MHDBDBFormModule,
    MHDBDBViewWidgetsModule,
    MaterialModule,
    StoreModule.forRoot({
      filter: filterReducer,
      generalFilter: generalFilterReducer,
      language: languageReducer,
      ui: uiReducer
    }),
    StoreDevtoolsModule.instrument({
      maxAge: 25 // Retains last 25 states
    }),
    RouterModule.forRoot(routes, { useHash: true, onSameUrlNavigation: 'reload' }),
    TreeModule,
    HttpClientModule
    // MarkdownModule.forRoot()
  ],
  exports: [MaterialModule],
  declarations: [
    AppComponent,
    AppHomeComponent,
    ErrorComponent,
    DhppNavbarComponent,
    DhppFooterComponent,
    DhppHeaderComponent,
    ScrollToTopComponent,
    DialogComponent
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: []
})
export class DhppbaseAppModule {}
