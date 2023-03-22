/* eslint-disable object-shorthand */
import { Injectable } from '@angular/core';
import { SERVER_API_URL } from '../../../../../src/main/webapp/app/app.constants';

@Injectable({ providedIn: 'root' })
export class DhPlusService {
  public resourceUrl = `${SERVER_API_URL}services/rdf/api/query/sparql`;

  constructor() { }

  query(queryString: string) {
    return fetch(this.resourceUrl, {
      method: 'POST',
      body: 'query=' + encodeURIComponent(queryString),
      headers: {
        'Content-type': 'application/x-www-form-urlencoded'
      }
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
