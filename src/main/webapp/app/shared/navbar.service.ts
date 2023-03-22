import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavbarService {
  private isShow: boolean;

  public showNavbar: Subject<boolean>;
  public setStyle: Subject<any>;

  constructor() {
    this.showNavbar = new Subject<boolean>();
    this.setStyle = new Subject<any>();
  }

  show() {
    this.isShow = true;
    this.showNavbar.next(this.isShow);
  }

  hide() {
    this.isShow = false;
    this.showNavbar.next(this.isShow);
  }

  toggleNavbar() {
    this.isShow = !this.isShow;
    this.showNavbar.next(this.isShow);
  }
}
