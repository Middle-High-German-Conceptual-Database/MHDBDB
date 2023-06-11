import { Component, OnInit, Inject, HostListener } from '@angular/core';
import { DOCUMENT, Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { TextFilterI, TextOptionsI, TextQueryParameterI, TextService } from 'app/reference/reference.service';
import { DictionaryService } from 'app/dictionary/dictionary.service';
import { HistoryService } from 'app/shared/historyService';
import { ElectronicText } from 'app/reference/reference.class';

@Component({
  selector: 'app-fixed-form-footer',
  templateUrl: './fixed-form-footer.component.html',
  styleUrls: ['./fixed-form-footer.component.scss']
})
export class FixedFormFooterComponent implements OnInit {
  windowScrolled: boolean;

  routeString: string = '';

  constructor(
    @Inject(DOCUMENT) private document: Document,
    public router: Router,
    public route: ActivatedRoute,
    public locationService: Location,
    public http: HttpClient,
    public service: TextService, // --> service
    public dicService: DictionaryService,
    public history: HistoryService<TextQueryParameterI, TextFilterI, TextOptionsI, ElectronicText>
  ) {
    //super(router, route, locationService, http, service, history);
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop > 100) {
      this.windowScrolled = true;
    } else if ((this.windowScrolled && window.pageYOffset) || document.documentElement.scrollTop || document.body.scrollTop < 10) {
      this.windowScrolled = false;
    }
  }
  scrollToTop() {
    (function smoothscroll() {
      var currentScroll = document.documentElement.scrollTop || document.body.scrollTop;
      if (currentScroll > 0) {
        window.requestAnimationFrame(smoothscroll);
        window.scrollTo(0, currentScroll - currentScroll / 8);
      }
    })();
  }
  ngOnInit() {}
}
