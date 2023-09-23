import { Component, HostListener } from "@angular/core";

@Component({
    selector: 'dhpp-welcome-dialog',
    templateUrl: 'app.welcome-dialog.html',
})
export class DhppWelcomeDialog {

    display: string = 'none';

    open() {
        this.display = 'block';
    }

    close() {
        this.display = 'none';
    }

}
