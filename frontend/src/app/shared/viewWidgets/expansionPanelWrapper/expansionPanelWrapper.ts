import { Component, Input, ViewChild } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { MhdbdbIdLabelEntity } from '../../baseIndexComponent/baseindexcomponent.class';
import { FilterIdI, MhdbdbGraphService, OptionsI, QueryParameterI } from '../../mhdbdb-graph.service';

@Component({
    selector: 'expansion-panel-wrapper',
    template: `
    <mat-expansion-panel [expanded]="true" *ngIf="asPanel; else notAsPanel">
        <mat-expansion-panel-header>
            <mat-panel-title>
                <h2>{{title}}</h2>
            </mat-panel-title>
            <mat-panel-description>
                
            </mat-panel-description>
        </mat-expansion-panel-header>
        <p>
            <ng-content *ngTemplateOutlet="notAsPanel">
            </ng-content>
        </p>
        <mat-action-row>
            <button mat-button type="button" (click)="triggerOpenHelp()"><i class="fas fa-question-circle"></i></button>
        </mat-action-row>
    </mat-expansion-panel>

    <ng-template #notAsPanel>
      <ng-content>
      </ng-content>
    </ng-template>

    `,      
})
export class ExpansionPanelWrapperComponent<qT extends QueryParameterI<f, o>, f extends FilterIdI, o extends OptionsI, c extends MhdbdbIdLabelEntity, s extends MhdbdbGraphService<qT, f, o, c>> {    
    @Input() title: string;
    @Input() asPanel: boolean;    
    @Input() openHelpSubject: BehaviorSubject<boolean>;    
    @Input() expandAll: boolean;

    triggerOpenHelp() {        
        this.openHelpSubject.next(true);
    }
}