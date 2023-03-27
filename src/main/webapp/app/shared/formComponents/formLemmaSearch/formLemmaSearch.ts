import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { HistoryService } from '../../historyService';
import { FilterLabelI, OptionsI, QueryParameterI } from '../../mhdbdb-graph.service';
import { FormDirective } from '../formDirective';

@Component({
    selector: 'dhpp-form-LemmaSearch',
    templateUrl: './formLemmaSearch.html',
    styleUrls: ['./formLemmaSearch.scss']
})
export class FormLemmaSearchComponent<qT extends QueryParameterI<f, o>, f extends FilterLabelI, o extends OptionsI, instanceClass> extends FormDirective<qT,f,o,instanceClass> implements OnInit, OnDestroy {

    constructor(
        public historyService: HistoryService<qT, f, o, instanceClass>,
        public help: MatDialog
    ) {
        super(historyService, help)
    }

    initHtmlForm(filterMap: f) {
        this.form = new FormGroup({
            label: new FormControl(filterMap.label),
            isLabelActive: new FormControl(filterMap.isLabelActive),
        });
    }

    loadFilter(filterMap: f) {
        if (this.form.get('isLabelActive').value != filterMap.isLabelActive) {
            this.form.patchValue({
                isLabelActive: filterMap.isLabelActive,
            })
        }

        if (this.form.get('label').value != filterMap.label) {
            this.form.patchValue({
                label: filterMap.label,
            })
        }
    }

    onValueChanges(value) {
        let changed:boolean = false
        if (this.qp.filter.isLabelActive != value.isLabelActive) {
            this.qp.filter.isLabelActive = value.isLabelActive
            changed = true
        }
        if (this.qp.filter.label != value.label) {
            this.qp.filter.label = value.label
            changed = true
        }
        return changed
    }

    openHelp() {
        const dialogRef = this.help.open(FormLemmaSearchHelpComponent);
        dialogRef.afterClosed().subscribe(result => {
            console.log(`Dialog result: ${result}`);
        });
    }

    ngOnInit() {
        super.ngOnInit()
    }

    ngOnDestroy(): void {
        super.ngOnDestroy()
    }
}

@Component({
    selector: 'dhpp-form-LemmaSearch-help',
    templateUrl: './formLemmaSearchHelp.html',
})
export class FormLemmaSearchHelpComponent { }
