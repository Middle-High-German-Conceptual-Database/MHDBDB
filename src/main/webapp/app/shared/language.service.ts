import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private _currentLang: string;

  constructor() {
    this.init();
  }

  public init() {
    const re = /-.*/g;
    this.changeLanguage(navigator.language.replace(re, ''));
  }

  public changeLanguage(lang: string) {
    this._currentLang = lang;
  }

  public getCurrent(): Promise<string> {
    return new Promise<string>(resolve => resolve(this._currentLang));
  }
}
