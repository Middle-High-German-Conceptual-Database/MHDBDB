import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseIndexElementDirective } from '../../baseIndexComponent/element/element.component';
import { WorkClass, WorkMetadataClass } from '../../../work/work.class';
import { WorkFilterI, WorkOptionsI, WorkQueryParameterI, WorkService } from '../../../work/work.service';
import { Utils } from 'app/shared/utils';
import { SenseClass, WordClass } from 'app/dictionary/dictionary.class';
import { DictionaryQueryParameterI, DictionaryService } from 'app/dictionary/dictionary.service';
import { TextPassageService } from 'app/reference/referencePassage.service';
import { TextService } from 'app/reference/reference.service';
import { Kwic } from 'app/text/text.class';

@Component({
  selector: 'dhpp-text-element',
  templateUrl: './text-element.component.html',
  styleUrls: ['text-element.component.scss']
})
export class TextElementComponent extends BaseIndexElementDirective<WorkClass, WorkQueryParameterI, WorkFilterI, WorkOptionsI>
  implements OnInit {
  senses: SenseClass[] = [];

  @Input() public instance: any;

  @Input() public qp: any;

  kwics: Kwic[] = [];

  total: number = 0;

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public locationService: Location,
    public http: HttpClient,
    public service: WorkService,
    public dicService: DictionaryService,
    public referenceService: TextService,
    public textService: TextService
  ) {
    super(router, route, locationService, http, service);
  }

  ngOnInit(): void {
    super.ngOnInit();
    //console.log(this.instance);

    // this.loadSenses();
    // this.loadOccurrences();
  }

  loadSenses() {
    console.log(this.instance);
    if (this.instance) {
      this.referenceService.getKwic('https://dh.plus.ac.at/mhdbdb/text/ADP#ADP_4815200_2').then(data => {
        console.log(data);
      });

      /* this.dicService.getSenses(this.instance).then( data => {
        this.senses = data
        this.total = data.length
        console.log(this.senses);
      }) */
    }
  }

  public loadOccurrences() {
    console.log(this.instance);
    this.textService
      .getAnnotations(0, 10, this.instance.rootId, undefined, 'tei:seg')
      .then(annotations => {
        this.total = annotations[1];
        if (annotations[1] > 0) {
          annotations[0].forEach(annotation => {
            this.textService.getKwic(annotation.target).then(kwic => {
              console.log(kwic);
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

  /*getWorkId(): string {
    return Utils.removeNameSpace(this.instance.workId);
  }*/
}
