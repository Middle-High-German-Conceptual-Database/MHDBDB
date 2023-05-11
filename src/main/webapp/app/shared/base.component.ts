import { Subscription } from 'rxjs';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { Account, AccountService, EventManager } from './base.imports';

export class BaseComponent {
  account: Account;
  authSubscription: Subscription;
  modalRef: NgbModalRef;

  constructor(public accountService: AccountService, public eventService: EventManager) {}

  registerAuthenticationSuccess() {
    /* this.authSubscription = this.eventManager.subscribe('authenticationSuccess', () => {
      this.accountService.identity().subscribe(account => {
        this.account = account;
      });
    }); */
  }

  isAuthenticated() {
    return this.accountService.isAuthenticated();
  }

}
