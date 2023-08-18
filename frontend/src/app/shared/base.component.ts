import { Subscription } from 'rxjs';

import { Account, EventManager } from './base.imports';

export class BaseComponent {
  account: Account;
  authSubscription: Subscription;

  constructor(public eventService: EventManager) {}

  registerAuthenticationSuccess() {
    /* this.authSubscription = this.eventManager.subscribe('authenticationSuccess', () => {
      this.accountService.identity().subscribe(account => {
        this.account = account;
      });
    }); */
  }

  isAuthenticated() {
    // return this.accountService.isAuthenticated();
  }

}
