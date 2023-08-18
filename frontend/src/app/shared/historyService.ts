import { ActivatedRoute } from '@angular/router';
/* eslint-disable object-shorthand */
import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { MhdbdbGraphService, FilterIdI, OptionsI, QueryParameterI, FilterI } from './mhdbdb-graph.service';
import { BehaviorSubject, Observable, Subject, ReplaySubject } from 'rxjs';
import { ListHistoryEntry } from './history.class'

// see https://blog.angular-university.io/how-to-build-angular2-apps-using-rxjs-observable-data-services-pitfalls-to-avoid/

@Injectable({ providedIn: 'root' })
export class HistoryService<qT extends QueryParameterI<f, o>, f extends FilterI, o extends OptionsI, instanceClass> {
    private _history: ListHistoryEntry<qT, f, o, instanceClass>[] = []
    private _historySubject: BehaviorSubject<ListHistoryEntry<qT, f, o, instanceClass>[]> = new BehaviorSubject(this._history)
    public readonly history: Observable<ListHistoryEntry<qT, f, o, instanceClass>[]> = this._historySubject.asObservable()
    constructor() {
        
    }   

    initListHistoryEntry<s extends MhdbdbGraphService<qT, f, o, instanceClass>>(routeString: string, mhdbdbService: s): Promise<ListHistoryEntry<qT, f, o, instanceClass>> {          
        return new Promise<ListHistoryEntry<qT, f, o, instanceClass>>((resolve) => {
            if (!this._history.find(element => element.routeString == routeString)) {
                const he = new ListHistoryEntry<qT, f, o, instanceClass>(mhdbdbService.defaultQp, routeString)                
                this._history.push(he)                
                this._historySubject.next(this._history)
            }
            resolve(this.getListHistoryEntry(routeString))
        })
    }

    getListHistoryEntry(routeString: string): ListHistoryEntry<qT, f, o, instanceClass> {
        return this._history.find(element => element.routeString == routeString)
    }    
}
