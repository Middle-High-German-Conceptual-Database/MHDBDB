import { Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HistoryService } from '../../historyService';
import { FilterPosI, OptionsI, QueryParameterI } from '../../mhdbdb-graph.service';
import { PoS } from '../../pos/pos.class';
import { PosService } from '../../pos/pos.service';
import { FormDirective } from '../formDirective'

@Component({
    selector: 'dhpp-form-posCheckboxes',
    templateUrl: './formPosCheckboxes.html',
    styleUrls: ['./formPosCheckboxes.scss']
})
export class FormPosCheckboxesComponent<qT extends QueryParameterI<f, o>, f extends FilterPosI, o extends OptionsI> extends FormDirective<qT,f,o, PoS> implements OnInit, OnDestroy {        
    filterPosCheckboxes: FormGroup
    posList: PoS[]
    constructor(
        public historyService: HistoryService<qT, f, o, PoS>,    
        public help: MatDialog,        
        public posService: PosService, 
    ) {
        super(historyService, help)
    }

    initHtmlForm(filterMap: f) {
        this.filterPosCheckboxes = new FormGroup({});
        this.posList.forEach(
            (item) => {
                if (filterMap.pos.includes(item.id)) {
                    this.filterPosCheckboxes.addControl(item.label, new FormControl(true))
                } else {
                    this.filterPosCheckboxes.addControl(item.label, new FormControl(false))
                }
            }
        )
        this.form = new FormGroup({    
            filterPosCheckboxes: this.filterPosCheckboxes,
            isPosActive: new FormControl(filterMap.isPosActive)
        });        
    }

    loadFilter(filterMap: f) {         
        if (this.form.get('isPosActive').value != filterMap.isPosActive) {
            this.form.patchValue({
                isPosActive: filterMap.isPosActive,
            })
        }  
        Object.keys(this.filterPosCheckboxes.controls).forEach(controlLabel => {            
            const pos = this.posList.find(element => element.label == controlLabel)
            if (pos) {
                let control = this.filterPosCheckboxes.get(controlLabel)                
                if (filterMap.pos.includes(pos.id)) {
                    control.setValue(true)
                } else {
                    control.setValue(false)
                }
            }
        });
    }

    onValueChanges(value) {
        let changed: boolean = false
        if (this.qp.filter.isPosActive != value.isPosActive) {
            this.qp.filter.isPosActive = value.isPosActive
            changed = true
        }
        let posList$:string[]= []
        for (let label in value.filterPosCheckboxes) {
            const e = this.posList.find(element => element.label == label)
            if (value.filterPosCheckboxes[label] == true) {
                posList$.push(e.id)
            }
        }
        if (posList$.length != this.qp.filter.pos.length || !(posList$.every((v, i) => v === this.qp.filter.pos[i]))) {
            this.qp.filter.pos = posList$.slice()
            changed = true
        }     
        return changed 
    } 

    openHelp() {        
        const dialogRef = this.help.open(FormPosCheckboxesHelpComponent, {
            data: { posList: this.posList },
        });
        dialogRef.afterClosed().subscribe(result => {
            console.log(`Dialog result: ${result}`);
        });
    }
    
    ngOnInit() {
        this.posService.getTopConcepts().then(
            data => {
                this.posList = data as PoS[]
                super.ngOnInit()
            }
        )
    }
    
    ngOnDestroy(): void {
        super.ngOnDestroy()
    }
}

@Component({
    selector: 'dhpp-form-posCheckboxes-help',
    templateUrl: './formPosCheckboxesHelp.html',
})
export class FormPosCheckboxesHelpComponent { 
    constructor(@Inject(MAT_DIALOG_DATA) public data: { posList: PoS[] }) { }
}