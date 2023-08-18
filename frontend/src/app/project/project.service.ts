/* eslint-disable object-shorthand */
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { SERVER_API_URL, SERVER_API_SPARQL_URL } from 'app/app.constants';
import { MhdbdbGraphService } from '../shared/mhdbdb-graph.service';
import { selectLanguage } from 'app/store/language.reducer';

@Injectable({ providedIn: 'root' })
export class ProjectService {
  public resourceUrl = `${SERVER_API_URL}services/rdf/api/mhdbdb`;
  public functionsUrl = `${SERVER_API_URL}services/rdf/api/mhdbdb/f`;

  constructor(private http: HttpClient) {}
}
