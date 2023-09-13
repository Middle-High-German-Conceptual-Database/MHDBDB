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

@Component({
  selector: 'dhpp-widget-kwic',
  templateUrl: './kwicWidget.html',
  styleUrls: ['./kwicWidget.scss']
})
export class KwicWidgetComponent
  extends ViewWidgetsDirective<DictionaryQueryParameterI, DictionaryFilterI, DictionaryOptionsI, MhdbdbIdEntity, DictionaryService>
  implements OnInit {
  @Input() word;

  total: number;
  kwics: Kwic[] = [];
  public title: string = 'Keyword in context';
  punctuationRegexp = new RegExp('^[^ws]$');

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
    if (this.instance) {
      // this.loadOccurrences();
      this.textService.getKwic(this.word).then(kwic => {
        if (kwic) {
          this.kwics.push(kwic);
        }
      });

      this.isLoaded = Promise.resolve(true);
    }
  }

  openHelp() {
    const dialogRef = this.help.open(KwicWidgetHelpComponent);
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

  public loadOccurrences() {
    console.log(this.word);
    console.log(this.limit);
    console.log(this.offset);
    console.log(this.instance);
    this.textService
      .getAnnotations(100, this.offset, this.word, undefined, 'tei:seg')
      .then(annotations => {
        this.isLoaded = Promise.resolve(true);
        this.total = annotations[1];
        if (annotations[1] > 0) {
          annotations[0].forEach(annotation => {
            this.textService.getKwic(annotation.target).then(kwic => {
              if (kwic) {
                this.kwics.push(kwic);
              }
            });
          });
        } else {
          this.kwics = [];
        }
      })
      .catch(error => {
        // console.warn(error)
      });
  }

  public moreOccurrences() {
    this.offset = this.offset + this.limit;
    this.loadOccurrences();

    /* const annotationId = { id: this.word, strippedId: this.word } as MhdbdbIdEntity;
    this.textService.getKwic(annotationId.id).then(kwic => {
      if (kwic) {
        this.kwics.push(kwic);
      }
    }); */

  }
}

@Component({
  selector: 'dhpp-widget-kwic-help',
  templateUrl: './kwicWidgetHelp.html'
})
export class KwicWidgetHelpComponent { }
