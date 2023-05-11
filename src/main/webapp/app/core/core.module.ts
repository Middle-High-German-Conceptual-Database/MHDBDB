import { NgModule, LOCALE_ID } from '@angular/core';
import { DatePipe, registerLocaleData } from '@angular/common';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Title } from '@angular/platform-browser';
import { CookieModule } from 'ngx-cookie';
import locale from '@angular/common/locales/en';

import { ErrorHandlerInterceptor } from 'app/blocks/interceptor/errorhandler.interceptor';

import { LanguageService } from 'app/shared/base.imports';

@NgModule({
  imports: [
    HttpClientModule,
    CookieModule.forRoot(),
  ],
  providers: [
    Title,
    {
      provide: LOCALE_ID,
      useValue: 'en'
    },
    DatePipe,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorHandlerInterceptor,
      multi: true
    },
  ]
})
export class DhppbaseCoreModule {
  constructor(languageService: LanguageService) {
    registerLocaleData(locale);
    languageService.init();
  }
}
