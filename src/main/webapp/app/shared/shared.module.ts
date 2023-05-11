import { NgModule } from '@angular/core';
import { DhppbaseSharedLibsModule } from './shared-libs.module';
import { FindLanguageFromKeyPipe } from './language/find-language-from-key.pipe';
import { HasAnyAuthorityDirective } from './auth/has-any-authority.directive';
import { LeavedhplusComponent } from 'app/shared/leavedhplus/leavedhplus.component';

@NgModule({
  imports: [DhppbaseSharedLibsModule],
  declarations: [FindLanguageFromKeyPipe, HasAnyAuthorityDirective, LeavedhplusComponent],
  entryComponents: [LeavedhplusComponent],
  exports: [
    DhppbaseSharedLibsModule,
    FindLanguageFromKeyPipe,
    HasAnyAuthorityDirective,
    LeavedhplusComponent
  ]
})
export class DhppbaseSharedModule {}
