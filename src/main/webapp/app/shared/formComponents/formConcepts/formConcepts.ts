import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Concept } from '../../../concept/concept.class';
import { HistoryService } from '../../historyService';
import { FilterConceptsI, OptionsI, QueryParameterI } from '../../mhdbdb-graph.service';
import { FormDirective } from '../formDirective';
import { ConceptService } from './../../../concept/concept.service';

@Component({
    selector: 'dhpp-form-concepts',
    templateUrl: './formConcepts.html',
    styleUrls: ['./formConcepts.scss']
})
export class FormConceptsComponent<qT extends QueryParameterI<f, o>, f extends FilterConceptsI, o extends OptionsI> extends FormDirective<qT, f, o, Concept> implements OnInit, OnDestroy {
    filterConcepts

    conceptList: Concept[] = []
    conceptLabels: string[] = []

    // chips input for concepts
    readonly separatorKeysCodes: number[] = [ENTER, COMMA];
    selectable = true;
    removable = true;
    addOnBlur = true;
    visible = true;

    // autocomplete concepts
    conceptCtrl = new FormControl();
    filteredConcepts: Observable<string[]>;

    @ViewChild('conceptInput', { static: false }) conceptInput: ElementRef<HTMLInputElement>;
    @ViewChild('auto', { static: false }) matAutocomplete: MatAutocomplete;

    constructor(
        public historyService: HistoryService<qT, f, o, Concept>,
        public help: MatDialog,
        public conceptService: ConceptService,
    ) {
        super(historyService, help)
        this.filteredConcepts = this.conceptCtrl.valueChanges.pipe(
            startWith(null),
            map((concept: string | null) => concept ? this._filterConcept(concept) : this.conceptLabels.slice()));
    }

    private _filterConcept(value: string): string[] {
        const filterValue = value.toLowerCase();
        return this.conceptLabels.filter(concept => concept.toLowerCase().indexOf(filterValue) === 0);
    }

    get concepts() {
        return <FormGroup>this.form.get('filterConcepts')
    }

    removeConcept(conceptLabel: string): void {
        this.concepts.removeControl(conceptLabel);
        this.concepts.updateValueAndValidity();
    }

    selectedConcept(event: MatAutocompleteSelectedEvent): void {
        this.concepts.addControl(event.option.viewValue, new FormControl(true))
        this.conceptInput.nativeElement.value = '';
        this.conceptCtrl.setValue(null);
    }

    initHtmlForm(filterMap: f) {
        this.filterConcepts = new FormGroup({});
        this.form = new FormGroup({
            filterConcepts: this.filterConcepts,
            isConceptsActive: new FormControl(filterMap.isConceptsActive)
        });

        this.conceptList.forEach((concept) => {
            this.conceptLabels.push(concept.label)
            if (filterMap.concepts.includes(concept.id)) {
                this.concepts.addControl(concept.label.trim(), new FormControl(true))
            }
        })
    }

    loadFilter(filterMap: f) {
        if (this.form.get('isConceptsActive').value != filterMap.isConceptsActive) {
            this.form.patchValue({
                isConceptsActive: filterMap.isConceptsActive,
            })
        }

        this.conceptList.forEach(
            concept => {
                this.concepts.removeControl(concept.label);
            }
        )

        filterMap.concepts.forEach(
            conceptUri => {
                const concept = this.conceptList.find(element => element.id == conceptUri)
                if (concept) {
                    this.concepts.addControl(concept.label.trim(), new FormControl(true))
                } else {
                    console.error("concept not found: " + conceptUri)
                }

            }
        )
    }

    onValueChanges(value) {
        this.qp.filter.isConceptsActive = value.isConceptsActive
        this.qp.filter.concepts = []
        for (let v in value.filterConcepts) {
            const e = this.conceptList.find(element => element.label === v)
            this.qp.filter.concepts.push(e.id)
        }
        return true
    }

    openHelp() {
        const dialogRef = this.help.open(FormConceptsHelpComponent);
        dialogRef.afterClosed().subscribe(result => {
            console.log(`Dialog result: ${result}`);
        });
    }

    ngOnInit() {
        this.conceptService.getAllConcepts().then(
            data => {
                this.conceptList = data
              console.log(data);
                super.ngOnInit()
            }
        )
    }

    ngOnDestroy(): void {
        super.ngOnDestroy()
    }
}

@Component({
    selector: 'dhpp-form-concepts-help',
    templateUrl: './formConceptsHelp.html',
})
export class FormConceptsHelpComponent { }
