import { NgModule } from '@angular/core';
import { DhppbaseSharedLibsModule } from './shared-libs.module';
import { FindLanguageFromKeyPipe } from './language/find-language-from-key.pipe';
import { DhppAlertComponent } from './alert/alert.component';
import { DhppAlertErrorComponent } from './alert/alert-error.component';
import { DhppLoginModalComponent } from './login/login.component';
import { HasAnyAuthorityDirective } from './auth/has-any-authority.directive';
import { LeavedhplusComponent } from 'app/shared/leavedhplus/leavedhplus.component';

@NgModule({
  imports: [DhppbaseSharedLibsModule],
  declarations: [FindLanguageFromKeyPipe, DhppAlertComponent, DhppAlertErrorComponent, HasAnyAuthorityDirective, LeavedhplusComponent],
  entryComponents: [LeavedhplusComponent],
  exports: [
    DhppbaseSharedLibsModule,
    FindLanguageFromKeyPipe,
    DhppAlertComponent,
    DhppAlertErrorComponent,
    HasAnyAuthorityDirective,
    LeavedhplusComponent
  ]
})
export class DhppbaseSharedModule {}
