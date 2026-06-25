import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { WordClass, SenseClass } from '../../../dictionary/dictionary.class';
import {
  DictionaryFilterI,
  DictionaryOptionsI,
  DictionaryQueryParameterI,
  DictionaryService
} from '../../../dictionary/dictionary.service';
import { MhdbdbIdEntity, IdLabelI } from '../../baseIndexComponent/baseindexcomponent.class';
import { Kwic, Token } from '../../../text/text.class';
import { TextService } from '../../../text/text.service';
import { ViewWidgetsDirective } from '../viewWidgetsDirective';
import { KwicWidgetComponent } from '../kwicWidget/kwicWidget';
import { MHDBDBViewWidgetsModule } from "../viewWidgetsModule";

@Component({
  selector: 'dhpp-widget-kwic-panel',
  templateUrl: './kwicWidgetPanel.html',
  styleUrls: ['./kwicWidgetPanel.scss'],
  imports: [MHDBDBViewWidgetsModule],
})
export class KwicWidgetPanelComponent
  //extends ViewWidgetsDirective<DictionaryQueryParameterI, DictionaryFilterI, DictionaryOptionsI, MhdbdbIdEntity, DictionaryService> 
  extends KwicWidgetComponent
  implements OnInit {

  public title: string = 'Belegstellen';

  constructor(
    public service: DictionaryService,
    public help: MatDialog,
    public router: Router,
    public route: ActivatedRoute,
    public locationService: Location,
    public http: HttpClient,
    public textService: TextService
  ) {
    super(service, help);
  }

  ngOnInit(): void {
    super.ngOnInit();
    console.log("KwicWidgetPanelComponent ngOnInit", this.instance);
  }

  openHelp() {
    const dialogRef = this.help.open(KwicWidgetPanelHelpComponent);
    dialogRef.afterClosed().subscribe(result => {});
  }

}

@Component({
  selector: 'dhpp-widget-kwic-panel-help',
  templateUrl: './kwicWidgetPanelHelp.html'
})
export class KwicWidgetPanelHelpComponent { }
