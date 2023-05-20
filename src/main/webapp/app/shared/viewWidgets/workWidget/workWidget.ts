import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { MhdbdbIdEntity, IdLabelI } from '../../baseIndexComponent/baseindexcomponent.class';
import { Kwic, Token } from '../../../text/text.class';
import { TextService } from '../../../text/text.service';
import { ViewWidgetsDirective } from '../viewWidgetsDirective';
import { WorkFilterI, WorkOptionsI, WorkQueryParameterI, WorkService } from 'app/work/work.service';
import { WorkMetadataClass } from 'app/work/work.class';

@Component({
  selector: 'dhpp-widget-work',
  templateUrl: './workWidget.html',
  styleUrls: ['./workWidget.scss']
})
export class WorkWidgetComponent extends ViewWidgetsDirective<WorkQueryParameterI, WorkFilterI, WorkOptionsI, MhdbdbIdEntity, WorkService>
  implements OnInit {
  total: number;
  metadata: WorkMetadataClass;
  public title: string = 'Werk';
  punctuationRegexp = new RegExp('^[^ws]$');

  constructor(
    public service: WorkService,
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
      this.route.params.subscribe(params => {
        this.loadMetadata(params['id']);
        this.isLoaded = Promise.resolve(true);
      });
    }
  }

  openHelp() {
    const dialogRef = this.help.open(WorkWidgetHelpComponent);
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  joinTokens(tokens: Token[]) {
    let stringList: string[] = [];
    tokens.forEach(token =>
      stringList.push(this.punctuationRegexp.test(token.content) ? token.content.trim() : ' ' + token.content.trim())
    );
    return stringList.join('');
  }

  public loadMetadata(id: string) {
    this.service
      .getWorkMetadata(id)
      .then(data => {
        this.isLoaded = Promise.resolve(true);
        this.metadata = data[0][0];
        console.log(this.metadata);
      })
      .catch(error => {
        // console.warn(error)
      });
  }
}

@Component({
  selector: 'dhpp-widget-work-help',
  templateUrl: './workWidgetHelp.html'
})
export class WorkWidgetHelpComponent {}
