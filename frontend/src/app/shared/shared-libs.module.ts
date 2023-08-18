import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  exports: [
    FormsModule,
    CommonModule,
    InfiniteScrollModule,
    ReactiveFormsModule,
    TranslateModule
  ]
})
export class DhppbaseSharedLibsModule {}
