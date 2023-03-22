import { Injectable } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { LeavedhplusComponent } from './leavedhplus.component';

@Injectable({ providedIn: 'root' })
export class LeavedhplusModalService {
  private isOpen = false;
  constructor(private modalService: NgbModal) {}

  open(url: string): NgbModalRef {
    if (this.isOpen) {
      return;
    }
    this.isOpen = true;
    const modalRef = this.modalService.open(LeavedhplusComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.url = url;

    modalRef.result.then(
      result => {
        this.isOpen = false;
      },
      reason => {
        this.isOpen = false;
      }
    );
    return modalRef;
  }
}
