import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { GlobalSearchEntityClass } from '../../globalSearch/globalSearch.class';
import { GlobalSearchFilterI, GlobalSearchOptionsI, GlobalSearchQueryParameterI, GlobalSearchService } from '../../globalSearch/globalSearch.service';
import { ListHistoryEntry } from '../history.class';
import { HistoryService } from '../historyService';

@Component({
    selector: 'dhpp-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class DhppHeaderComponent implements OnInit, OnDestroy {

    form;
    he: ListHistoryEntry<GlobalSearchQueryParameterI, GlobalSearchFilterI, GlobalSearchOptionsI, GlobalSearchEntityClass>
    subscription: Subscription
    constructor(
        private router: Router,
        private service: GlobalSearchService,
        private history: HistoryService<GlobalSearchQueryParameterI, GlobalSearchFilterI, GlobalSearchOptionsI, GlobalSearchEntityClass>
    ) {
        this.form = new FormGroup({
            label: new FormControl(this.service.defaultFilter.label)
        })
    }

    startSearch() {
        let qp = this.he.getQp()
        if (this.form.get('label').value != qp.filter.label) {
            qp.filter.label = this.form.get('label').value
            this.he.setQp(qp)
            this.he.update()
        }
        this.router.navigate(['/globalSearch/list']);
    }

    ngOnInit() {
        this.history.initListHistoryEntry('globalSearch', this.service).then(
            he => {
                this.he = he
                this.subscription = he.qp
                    .subscribe(
                        data => {
                            const qp = this.he.getQp()
                            this.form.patchValue({
                                label: qp.filter.label,
                            })
                        }
                    )
            }
        )

    }

    ngOnDestroy(): void {
        if (this.subscription) {
          this.subscription.unsubscribe()
        }
    }
}
