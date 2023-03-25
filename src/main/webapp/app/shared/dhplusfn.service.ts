/* eslint-disable object-shorthand */
import { Injectable } from '@angular/core';
import { SERVER_API_URL } from '../../../../../src/main/webapp/app/app.constants';

@Injectable({ providedIn: 'root' })
export class DhPlusFnService {
  public resourceUrl = `${SERVER_API_URL}services/rest/api/rest/fn/`;

  constructor() { }

  get(fn: string, args: any) {
    let headers = new Headers();
    headers.append("Accept", "application/json");
    headers.append("Content-Type", "application/json");
    headers.append("Authorization", "Basic " + btoa(  "mhdbdb:2ffgMEdTo#HD"));

    return fetch(this.resourceUrl + fn, {
      method: 'GET',
      body: this.buildBody(args),
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

  post(fn: string, args: any) {
    let headers = new Headers();
    headers.append("Accept", "application/json");
    headers.append("Content-Type", "application/x-www-form-urlencoded");
    headers.append("Authorization", "Basic " + btoa(  "mhdbdb:2ffgMEdTo#HD"));

    return fetch(this.resourceUrl + fn, {
      method: 'POST',
      body: this.buildBody(args),
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

  buildBody(args: any) {
    let body = '';

    let c = 0;
    args.forEach(function (arg) {
      body += ((c==0) ? "" : "&") + arg.key + "=" + encodeURIComponent(arg.value);
      c++;
    });

    return body;
  }

}
