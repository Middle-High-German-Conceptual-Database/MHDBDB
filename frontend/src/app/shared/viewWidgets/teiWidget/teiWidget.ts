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
  public url: string = '/loading'; // Default URL
  public teiContent: string;

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
        // this.url = `/showTeiAsHtml?id=${id}`;
        this.fetchTeiData(id);
      }
    });
  }

  previousPage() {
    this.locationService.back();
  }

  fetchTeiData(id: string) {
    const body = {
      id: id,
      titleContent: "TEST",
      publicationContent: "YOUR_PUBLICATION_CONTENT_HERE", // Modify this as per your requirements
      sourceDescContent: "YOUR_SOURCE_DESC_CONTENT_HERE"    // Modify this as per your requirements
    };

    this.http.post('/showTeiAsHtml', body, { responseType: 'text' })
      .subscribe(
        data => {
          this.teiContent = data; // Store the received content

          const iframe = document.getElementById('teiFrame') as HTMLIFrameElement;
          const iframeDoc = iframe.contentDocument || (iframe.contentWindow && iframe.contentWindow.document);

          if (iframeDoc) {
            iframeDoc.open();
            iframeDoc.write(data);
            iframeDoc.close();
          }

        },
        error => {
          console.error('Error fetching TEI data:', error);
        }
      );
  }


}