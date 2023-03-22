import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { ListHistoryEntry, HistoryEntryStatic } from '../../history.class';
import { HistoryService } from '../../historyService';
import { FilterPosI, OptionsI, QueryParameterI } from '../../mhdbdb-graph.service';

@Component({
    selector: 'dhpp-form-footer',
    templateUrl: './formFooter.html',
    styleUrls: ['./formFooter.scss']
})
export class FormFooterComponent<qT extends QueryParameterI<f, o>, f extends FilterPosI, o extends OptionsI, instanceClass> {
    @Input() routeString: string;
    protected subscriptionForm: Subscription;
    public he: ListHistoryEntry<qT, f, o, instanceClass>
    notifier = new Subject()
    public history: HistoryEntryStatic<qT, f, o>[]
    private readonly _historySize: number
    constructor(
        public fb: FormBuilder,
        public historyService: HistoryService<qT, f, o, instanceClass>,
    ) {
        this._historySize = 5
    }

    initHtmlForm() {
    }

    search() {
        this.he.update()
    }

    ngOnInit() {
        this.historyService.history
            .pipe(takeUntil(this.notifier))            
            .subscribe(
                historyMap => {
                    this.he = this.historyService.getListHistoryEntry(this.routeString)
                    if (this.he) {                      
                        this.notifier.complete()
                    }
                }
            )
    }

    ngOnDestroy() {
        
    }
}