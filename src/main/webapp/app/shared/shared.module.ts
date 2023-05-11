import { NgModule } from '@angular/core';
import { DhppbaseSharedLibsModule } from './shared-libs.module';
import { FindLanguageFromKeyPipe } from './language/find-language-from-key.pipe';
import { HasAnyAuthorityDirective } from './auth/has-any-authority.directive';

@NgModule({
  imports: [DhppbaseSharedLibsModule],
  declarations: [FindLanguageFromKeyPipe, HasAnyAuthorityDirective],
  entryComponents: [],
  exports: [
    DhppbaseSharedLibsModule,
    FindLanguageFromKeyPipe,
    HasAnyAuthorityDirective,
  ]
})
export class DhppbaseSharedModule {}
