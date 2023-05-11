import { NgModule, LOCALE_ID } from '@angular/core';
import { DatePipe, registerLocaleData } from '@angular/common';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Title } from '@angular/platform-browser';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { CookieModule } from 'ngx-cookie';
import { TranslateModule, TranslateLoader, MissingTranslationHandler } from '@ngx-translate/core';
import { NgxWebstorageModule } from 'ngx-webstorage';
import locale from '@angular/common/locales/en';

import * as moment from 'moment';
import { NgbDateAdapter, NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateMomentAdapter } from 'app/shared/util/datepicker-adapter';

import { ErrorHandlerInterceptor } from 'app/blocks/interceptor/errorhandler.interceptor';

import { fontAwesomeIcons } from './icons/font-awesome-icons';
import { LanguageService } from 'app/shared/base.imports';

@NgModule({
  imports: [
    HttpClientModule,
    CookieModule.forRoot(),
    NgxWebstorageModule.forRoot({ prefix: 'dhpp', separator: '-' }),
  ],
  providers: [
    Title,
    {
      provide: LOCALE_ID,
      useValue: 'en'
    },
    { provide: NgbDateAdapter, useClass: NgbDateMomentAdapter },
    DatePipe,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorHandlerInterceptor,
      multi: true
    },
  ]
})
export class DhppbaseCoreModule {
  constructor(iconLibrary: FaIconLibrary, dpConfig: NgbDatepickerConfig, languageService: LanguageService) {
    registerLocaleData(locale);
    iconLibrary.addIconPacks(fas);
    iconLibrary.addIcons(...fontAwesomeIcons);
    dpConfig.minDate = { year: moment().year() - 100, month: 1, day: 1 };
    languageService.init();
  }
}
