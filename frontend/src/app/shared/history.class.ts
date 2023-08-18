import { BehaviorSubject, Observable } from 'rxjs';
import * as uuid from 'uuid';
import { MhdbdbEntity } from './baseIndexComponent/baseindexcomponent.class';
import { FilterI, FilterLabelI, OptionsI, QueryParameterI } from './mhdbdb-graph.service';

export class ListHistoryEntry
    <P extends QueryParameterI<F, O>,
    F extends FilterI,
    O extends OptionsI,
    E extends MhdbdbEntity
    >
{
    private _selectedHistoryId: string

    public readonly routeString: string
    private readonly _defaultQp: P

    private _qp: P
    private _qpSubject: BehaviorSubject<P>
    public readonly qp: Observable<P>

    private _returnedInstances: BehaviorSubject<number>
    public readonly returnedInstances: Observable<number>

    private _instancesSubject: BehaviorSubject<E[]>
    public readonly instances: Observable<E[]>

    private _history: BehaviorSubject<HistoryEntryStatic<P, F, O>[]>
    public readonly history: Observable<HistoryEntryStatic<P, F, O>[]>

    private _total: BehaviorSubject<number>
    public readonly total: Observable<number>

    private _queryCalled: BehaviorSubject<boolean>
    public readonly queryCalled: Observable<boolean>

    constructor(
        qp: P,
        routeString: string
    ) {
        this._defaultQp = JSON.parse(JSON.stringify(qp))
        this.routeString = routeString

        this._qp = (JSON.parse(JSON.stringify(qp)))
        this._qpSubject = new BehaviorSubject(JSON.parse(JSON.stringify(qp)))
        this.qp = this._qpSubject.asObservable()

        this._returnedInstances = new BehaviorSubject(0)
        this.returnedInstances = this._returnedInstances.asObservable()

        this._instancesSubject = new BehaviorSubject([])
        this.instances = this._instancesSubject.asObservable()

        this._total = new BehaviorSubject(0)
        this.total = this._total.asObservable()

        this._queryCalled = new BehaviorSubject(false)
        this.queryCalled = this._queryCalled.asObservable()

        this._history = new BehaviorSubject([])
        this.history = this._history.asObservable()

        this.addQpToHistory(this._qp)
    }

    // qp

    public setQp(qp: P) {
        this._qp = JSON.parse(JSON.stringify(qp))
    }

    public getQp(): P {
        return this._qpSubject.getValue()
    }

    public update() {
        this.addQpToHistory(this._qp)
        this._qpSubject.next(JSON.parse(JSON.stringify(this._qp)))
    }

    public resetQp() {
        this._qp = JSON.parse(JSON.stringify(this._defaultQp))
        this.setQp(this._qp)
        this.resetInstances()
        this.update()
    }

    // instances

    public initNewInstances(instances: E[], total: number= undefined) {
        this._total.next(total)
        this._queryCalled.next(true)
        this.addInstances(instances)
    }

    public resetInstances() {
        this._instancesSubject.next([])
        this._returnedInstances.next(0)
        this._total.next(0)
        this._queryCalled.next(false)
    }

    public getInstances(): E[] {
        return this._instancesSubject.getValue()
    }

    public addInstances(instances: E[]) {
        if (this._queryCalled.getValue() == true) {
            let _instances = this._instancesSubject.getValue()
            instances.forEach(instance => _instances.push(instance))
            this._instancesSubject.next(_instances)
            this._returnedInstances.next(
                this._returnedInstances.getValue() + instances.length
            )
        }
        else {
            throw console.error('before adding instances to history, initNewInstances has to be called');
        }

    }

    // total instance count
    public getTotal(): number {
        return this._total.getValue()
    }

    // queryCalled

    public getQueryCalled(): boolean {
        return this._queryCalled.getValue()
    }

    // history
    private addQpToHistory(qp: P) {
        const heStatic: HistoryEntryStatic<P, F, O> = new HistoryEntryStatic<P, F, O>(qp)
        let tempHistory = this._history.getValue() //Object.assign({}, this._history.getValue())
        tempHistory.push(heStatic)
        this._selectedHistoryId = heStatic.id
        this._history.next(tempHistory)
    }

    public loadQpFromHistory(id: string) {
        const heStatic = this._history.getValue().find(element => element.id == id)
        if (heStatic) {
            this._selectedHistoryId = heStatic.id
            this.setQp(JSON.parse(JSON.stringify(heStatic.qp)))
            this._qpSubject.next(JSON.parse(JSON.stringify(heStatic.qp)))
        }
    }

    public getLastQpFromHistory(i: number): HistoryEntryStatic<P, F, O>[] {
        return this._history.getValue().slice(-i)
    }
}

export class HistoryEntryStatic
    <P extends QueryParameterI<F, O>,
    F extends FilterI,
    O extends OptionsI
    >
{
    private readonly _qp: P
    public readonly id: string
    private readonly _time: Date
    public readonly hour: number
    public readonly minute: number
    public readonly label: string
    public readonly filterString: string
    constructor(
        qp: P,
    ) {
        this._qp = JSON.parse(JSON.stringify(qp));
        this.id = uuid.v4();
        this._time = new Date(Date.now())
        this.hour = this._time.getHours()
        this.minute = this._time.getMinutes()
        if (this.isLabelLike(qp.filter)) {
            const filterLabelLike = qp.filter as FilterLabelI
            if (filterLabelLike.label != '')
                this.label = filterLabelLike.label
        } else {
            this.label = "*"
        }
        this.filterString = JSON.stringify(this._qp.filter)

    }

    isLabelLike(filter: FilterLabelI | any): filter is FilterLabelI {
        return true
    }

    get qp(): P {
        return this._qp
    }
}