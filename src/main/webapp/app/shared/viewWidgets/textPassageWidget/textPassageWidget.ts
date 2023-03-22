import { Component, OnInit } from '@angular/core';
import { ViewWidgetsDirective } from '../viewWidgetsDirective';
import { TextPassageQueryParameterI, TextPassageFilterI, TextPassageOptionsI, TextPassageService } from '../../../text/textPassage.service'
import { TextPassage } from '../../../text/text.class'
@Component({
    selector: 'dhpp-widget-textPassage',
    templateUrl: './textPassageWidget.html',
    styleUrls: ['./textPassageWidget.scss']
})
export class TextPassageWidgetComponent extends ViewWidgetsDirective<TextPassageQueryParameterI, TextPassageFilterI, TextPassageOptionsI, TextPassage, TextPassageService> implements OnInit {
    public title: string = "Textpassage"

    ngOnInit(): void {
        super.ngOnInit()
        if (this.instance) {
            this.isLoaded = Promise.resolve(true)
        }        
    }

    openHelp() {
        const dialogRef = this.help.open(TextPassageWidgetHelpComponent);
        dialogRef.afterClosed().subscribe(result => {
            console.log(`Dialog result: ${result}`);
        });
    }
}

@Component({
    selector: 'dhpp-widget-textPassage-help',
    templateUrl: './textPassageWidgetHelp.html',
})
export class TextPassageWidgetHelpComponent { }