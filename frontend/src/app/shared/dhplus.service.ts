/* eslint-disable object-shorthand */
import { Injectable } from '@angular/core';
import { SERVER_API_URL } from 'app/app.constants';

@Injectable({ providedIn: 'root' })
export class DhPlusService {
  public resourceUrl = `${SERVER_API_URL}services/rdf/api/query/sparql`;

  constructor() { }

  query(queryString: string) {
    let headers = new Headers();
    headers.append("Accept", "application/json");
    headers.append("Content-Type", "application/x-www-form-urlencoded");
    headers.append("Authorization", "Basic " + btoa(  "mhdbdb:2ffgMEdTo#HD"));

    return fetch(this.resourceUrl, {
      method: 'POST',
      body: 'query=' + encodeURIComponent(queryString),
      headers
    }).then(function (response) {
      if (response.ok) {
        return response.json();
      }
      return Promise.reject(response);
    }).catch(function (error) {
      // console.warn('Something went wrong.', error);
    });
  }

}
