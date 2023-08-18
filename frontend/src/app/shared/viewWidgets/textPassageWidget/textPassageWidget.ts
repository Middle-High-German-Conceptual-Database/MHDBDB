import { Component, OnInit } from '@angular/core';
import { ViewWidgetsDirective } from '../viewWidgetsDirective';
import { TextPassageQueryParameterI, TextPassageFilterI, TextPassageOptionsI, TextPassageService } from '../../../text/textPassage.service';
import { TextPassage } from '../../../text/text.class';
import { DictionaryService } from 'app/dictionary/dictionary.service';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'dhpp-widget-textPassage',
  templateUrl: './textPassageWidget.html',
  styleUrls: ['./textPassageWidget.scss']
})
export class TextPassageWidgetComponent
  extends ViewWidgetsDirective<TextPassageQueryParameterI, TextPassageFilterI, TextPassageOptionsI, TextPassage, TextPassageService>
  implements OnInit {
  public title: string = 'Textpassage';

  constructor(
    public service: TextPassageService,
    public help: MatDialog,
    public router: Router,
    public route: ActivatedRoute,
    public locationService: Location,
    public http: HttpClient
  ) {
    super(service, help);
  }

  ngOnInit(): void {
    super.ngOnInit();
    if (this.instance) {
      this.isLoaded = Promise.resolve(true);
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
  templateUrl: './textPassageWidgetHelp.html'
})
export class TextPassageWidgetHelpComponent {}
