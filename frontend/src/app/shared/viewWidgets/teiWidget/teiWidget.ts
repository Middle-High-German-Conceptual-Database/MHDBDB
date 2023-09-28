import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'dhpp-widget-tei',
  templateUrl: './teiWidget.html',
  styleUrls: ['./teiWidget.scss']
})
export class TeiWidgetComponent implements OnInit {
    public title: string = 'TEI';
    public url: string = '/showTeiAsHtml?id=demo'; // Default URL
  
    constructor(
      public router: Router,
      public route: ActivatedRoute,
      public locationService: Location,
      public http: HttpClient
    ) { }
  
    ngOnInit(): void {
      // Fetch the 'id' parameter from the route.
      this.route.paramMap.subscribe(params => {
        const id = params.get('id');
        if (id) {
          // Modify the url based on the id. This is just an example, modify as per your requirements.
          this.url = `/showTeiAsHtml?id=${id}`;
        }
      });
    }

    previousPage() {
        this.locationService.back();
      }
  }