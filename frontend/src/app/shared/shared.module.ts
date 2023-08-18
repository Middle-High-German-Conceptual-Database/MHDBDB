import { NgModule } from '@angular/core';
import { DhppbaseSharedLibsModule } from './shared-libs.module';
import { FindLanguageFromKeyPipe } from './language/find-language-from-key.pipe';

@NgModule({
  imports: [DhppbaseSharedLibsModule],
  declarations: [FindLanguageFromKeyPipe],
  entryComponents: [],
  exports: [
    DhppbaseSharedLibsModule,
    FindLanguageFromKeyPipe,
  ]
})
export class DhppbaseSharedModule {}
