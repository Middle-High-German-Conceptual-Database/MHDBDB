import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { selectDialog } from './store/ui.reducer';
import { Store, select } from '@ngrx/store';
import { Modal } from 'bootstrap'; // You need bootstrap's js library to create a Modal instance.
import { closeDialog } from './store/ui.actions';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'dhpp-app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {
  pageTitle = 'dhppapp';

  @ViewChild('globalModal') modalElement: ElementRef;

  modalTitle = '';
  modalContent = '';
  modalInstance: Modal;

  constructor(private store: Store, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    // this.store.select('ui').subscribe(uiState => console.log(uiState));
    //this.store.pipe(select(selectDialog)).subscribe(dialog => console.log(dialog));

    this.store.pipe(select(selectDialog)).subscribe(dialog => {
      if (dialog.open) {
        this.modalTitle = dialog.data.title;
        this.modalContent = dialog.data.content;
        this.modalInstance.show();
        this.cdr.detectChanges(); // manually trigger change detection
      } else {
        this.modalInstance.hide();
        this.cdr.detectChanges(); // manually trigger change detection
      }
    });
  }

  ngAfterViewInit() {
    this.modalInstance = new Modal(this.modalElement.nativeElement);
  }

  closeModal() {
    this.store.dispatch(closeDialog());
  }
}
