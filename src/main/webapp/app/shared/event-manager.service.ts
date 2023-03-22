import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class EventManager {
  constructor() {}

  public broadcast(param: any) {}

  public destroy(t: any) {}

  public subscribe(param: any, f: Function) {
    return {};
  }
}
