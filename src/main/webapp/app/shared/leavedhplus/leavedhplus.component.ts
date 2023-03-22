import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'dhpp-leavedhplus',
  templateUrl: './leavedhplus.component.html'
})
export class LeavedhplusComponent implements OnInit {
  timer = 0;

  @Input() public url;

  countdown: any;

  constructor(public activeModal: NgbActiveModal) {}

  ngOnInit() {
    this.timer = 5;
    function func(s) {
      if (s.timer <= 0) {
        clearInterval(s.countdown);
        s.activeModal.close();
        const _url = s.url;
        const tabWindowId = window.open('about:blank', '_blank');
        tabWindowId.location.href = _url;
      }

      s.timer = s.timer - 1;
    }
    this.countdown = setInterval(func, 1000, this); // third parameter is argument to called function 'func'
  }

  goto(url: string) {
    clearInterval(this.countdown);
    this.activeModal.close();
    const _url = url;
    const tabWindowId = window.open('about:blank', '_blank');
    tabWindowId.location.href = _url;
  }
}
