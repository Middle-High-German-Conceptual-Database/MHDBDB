import { Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GlobalSearchEntityClass } from '../../../globalSearch/globalSearch.class';
import { HistoryService } from '../../historyService';
import { classFilter, classFilterT, FilterClassI, FilterPosI, LabeledClassfilterI, OptionsI, QueryParameterI } from '../../mhdbdb-graph.service';
import { PosService } from '../../pos/pos.service';
import { FormDirective } from '../formDirective'

@Component({
    selector: 'dhpp-form-classCheckboxes',
    templateUrl: './formClassCheckboxes.html',
    styleUrls: ['./formClassCheckboxes.scss']
})
export class FormClassCheckboxesComponent<qT extends QueryParameterI<f, o>, f extends FilterClassI, o extends OptionsI> extends FormDirective<qT,f,o, GlobalSearchEntityClass> implements OnInit, OnDestroy {
    filterClassCheckboxes: FormGroup
    constructor(
        public historyService: HistoryService<qT, f, o, GlobalSearchEntityClass>,
        public help: MatDialog,
    ) {
        super(historyService, help)
    }

    initHtmlForm(filterMap: f) {
        this.filterClassCheckboxes = new FormGroup({});
        classFilter.forEach(
            (item) => {
                if (filterMap && filterMap.classFilter && filterMap.classFilter.includes(item.classFilter)) {
                    this.filterClassCheckboxes.addControl(item.de, new FormControl(true))
                } else {
                    this.filterClassCheckboxes.addControl(item.de, new FormControl(false))
                }
            }
        )
        this.form = new FormGroup({
            filterClassCheckboxes: this.filterClassCheckboxes,
            isClassFilterActive: new FormControl(filterMap.isClassFilterActive)
        });
    }

    loadFilter(filterMap: f) {
        if (this.form.get('isClassFilterActive').value != filterMap.isClassFilterActive) {
            this.form.patchValue({
                isClassFilterActive: filterMap.isClassFilterActive,
            })
        }
        Object.keys(this.filterClassCheckboxes.controls).forEach(controlLabel => {
            const c = classFilter.find(element => element.de == controlLabel)
            if (c) {
                let control = this.filterClassCheckboxes.get(controlLabel)
                if (filterMap.classFilter.includes(c.classFilter)) {
                    control.setValue(true)
                } else {
                    control.setValue(false)
                }
            }
        });
    }

    onValueChanges(value) {
        let changed: boolean = false
        if (this.qp.filter.isClassFilterActive != value.isClassFilterActive) {
            this.qp.filter.isClassFilterActive = value.isClassFilterActive
            changed = true
        }
        let classList$: classFilterT[]= []
        for (let label in value.filterClassCheckboxes) {
            const e = classFilter.find(element => element.de == label)
            if (value.filterClassCheckboxes[label] == true) {
                classList$.push(e.classFilter)
            }
        }
        if (classList$.length != this.qp.filter.classFilter.length || !(classList$.every((v, i) => v === this.qp.filter.classFilter[i]))) {
            this.qp.filter.classFilter = classList$.slice()
            changed = true
        }
        return changed
    }

    openHelp() {
        const dialogRef = this.help.open(FormClassCheckboxesHelpComponent, {
            data: { classList: classFilter },
        });
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
    selector: 'dhpp-form-classCheckboxes-help',
    templateUrl: './formClassCheckboxesHelp.html',
})
export class FormClassCheckboxesHelpComponent {
    constructor(@Inject(MAT_DIALOG_DATA) public data: { classList: LabeledClassfilterI[] }) { }
}
