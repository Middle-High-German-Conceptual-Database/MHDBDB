import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from './dhpp-help-dialog.component';
import { closeDialog } from '../store/ui.actions';
import { selectDialog } from '../store/ui.reducer';

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  constructor(private store: Store, private dialog: MatDialog) {
    this.store.pipe(select(selectDialog)).subscribe(dialog => {
      // Use your selector here
      if (dialog.open) {
        this.dialog
          .open(DialogComponent, {
            data: { title: dialog.data.title, content: dialog.data.content }
          })
          .afterClosed()
          .subscribe(() => {
            this.store.dispatch(closeDialog());
          });
      } else {
        this.dialog.closeAll();
      }
    });
  }
}
