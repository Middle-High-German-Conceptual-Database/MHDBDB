import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { WorkMetadataClass } from 'app/work/work.class';
import { SERVER_API_URL_WORKS } from 'app/app.constants';
import { SparqlQueryResultI } from 'app/shared/mhdbdb-graph.service';
import { WorkService } from 'app/work/work.service';
@Component({
  selector: 'dhpp-widget-tei',
  templateUrl: './teiWidget.html',
  styleUrls: ['./teiWidget.scss']
})
export class TeiWidgetComponent implements OnInit {
  public title: string = 'TEI';
  public url: string = 'loading'; // Default URL
  public teiContent: string = '';
  public searchTerm: string | undefined;
  metadata: WorkMetadataClass | undefined;

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public locationService: Location,
    public http: HttpClient, 
    public service: WorkService
  ) { }

  ngOnInit(): void {
    // Fetch the 'id' parameter from the route.
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        // Modify the url based on the id. This is just an example, modify as per your requirements.
        // this.url = `/showTeiAsHtml?id=${id}`;
        this.fetchTeiData(id);
        this.getWorkMetadata(id); 
      }
      const searchTerm = params.get('searchterm');
      if (searchTerm) {
        this.searchTerm = searchTerm;
        console.log("TeiWidgetComponent received searchTerm", {searchTerm: this.searchTerm, params});
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

    this.http.post('showTeiAsHtml', body, { responseType: 'text' })
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
          console.error('TeiWidgetComponent fetchTeiData: Error fetching TEI data:', error);
        }
      );
  }

  // TODO: fetch work title etc. from the backend
  async getWorkMetadata(workId: string) {
    // call a /metadatasimple  endpoint in the backend that just delivers the necessary data.
    // see WorkWidgetComponent and WorkService.getWorkMetadata for inspiration.
    // and set the metadata here. 
    // think about a metadata-loading-spinnner
    //this.metadata = new WorkMetadataClass(workId, "", [], [], []);

    this.service.getWorkMetadata(workId, 'metadatasimple').then(([metadataArray, count]) => {
      if (metadataArray && metadataArray.length > 0) {
        console.log('TeiWidgetComponent getWorkMetadata: found metadata for workId', {workId, metadata: metadataArray[0]});
        this.metadata = metadataArray[0]; // Assuming you want the first metadata object
      } else {
        console.log('TeiWidgetComponent getWorkMetadata: No metadata found for workId:', workId);
      }
    }).catch(error => {
      console.error('TeiWidgetComponent getWorkMetadata: Error fetching metadata:', error);
    });

    /*
    this.http.post<SparqlQueryResultI>(SERVER_API_URL_WORKS + '/metadatasimple', workId).toPromise<SparqlQueryResultI>().then(data => {
      if (data.results.bindings && data.results.bindings.length >= 1) {
        this.metadata = this._jsonToObjectMeta(data.results.bindings)
      }
    }).catch(error => {
      console.error('TeiWidgetComponent getWorkMetadata: Error fetching metadata:', error);
    });
    */
  }
}