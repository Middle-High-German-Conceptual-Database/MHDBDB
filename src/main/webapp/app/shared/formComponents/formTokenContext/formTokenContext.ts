import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { TextPassage } from '../../../text/text.class';
import {
  TokenFilterI,
  TextPassageFilterI,
  TextPassageOptionsI,
  TextPassageQueryParameterI,
  TextPassageService,
  defaultTokenFilter,
  contextUnits,
  contextRange
} from '../../../text/textPassage.service';
import { TextService } from '../../../text/text.service';
import { HistoryService } from '../../historyService';
import { FormDirective } from '../formDirective';
import { Store, select } from '@ngrx/store';
import { selectTokenFilterById } from 'app/store/filter.reducer';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { updateFilterById } from 'app/store/filter.actions';

@Component({
  selector: 'dhpp-form-tokenContext',
  templateUrl: './formTokenContext.html',
  styleUrls: ['./formTokenContext.scss']
})
export class FormTokenContextComponent
  extends FormDirective<TextPassageQueryParameterI, TextPassageFilterI, TextPassageOptionsI, TextPassage>
  implements OnInit, OnDestroy {
  contextUnits;
  contextRange;

  @Input() tokenFilter;
  @Input() filter: any;
  private destroy$ = new Subject<void>();

  constructor(
    public historyService: HistoryService<TextPassageQueryParameterI, TextPassageFilterI, TextPassageOptionsI, TextPassage>,
    public help: MatDialog,
    private store: Store
  ) {
    super(historyService, help);
  }

  initHtmlForm(filterMap: TextPassageFilterI) {
    this.contextUnits = contextUnits;
    this.contextRange = contextRange;
    this.form = new FormGroup({
      context: new FormControl(),
      contextUnit: new FormControl(),
      directlyFollowing: new FormControl()
    });
  }

  loadFilter(filterMap: TextPassageFilterI) {
    if (this.form.get('context').value != filterMap.context) {
      this.form.patchValue({
        context: filterMap.context
      });
    }
    if (this.form.get('contextUnit').value != filterMap.contextUnit) {
      this.form.patchValue({
        contextUnit: filterMap.contextUnit
      });
    }
    if (this.form.get('directlyFollowing').value != filterMap.directlyFollowing) {
      this.form.patchValue({
        directlyFollowing: filterMap.directlyFollowing
      });
    }
  }

  onValueChanges(value) {
    let changed: boolean = false;
    if (this.qp.filter.context != value.context) {
      this.qp.filter.context = value.context;
      changed = true;
    }
    if (this.qp.filter.contextUnit != value.contextUnit) {
      this.qp.filter.contextUnit = value.contextUnit;
      changed = true;
    }
    if (this.qp.filter.directlyFollowing != value.directlyFollowing) {
      this.qp.filter.directlyFollowing = value.directlyFollowing;
      changed = true;
    }

    if (changed) {
      const updatedFilter = { ...this.tokenFilter, ...value };
      this.store.dispatch(updateFilterById({ filterId: this.filter.id, newFilter: updatedFilter }));
    }

    return changed;
  }

  openHelp() {
    const dialogRef = this.help.open(FormTokenContextHelpComponent);
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  ngOnInit() {
    super.ngOnInit();

    this.tokenFilter = { ...this.tokenFilter } as TokenFilterI;

    this.store
      .pipe(
        select(selectTokenFilterById, { id: this.filter.id }),
        takeUntil(this.destroy$)
      )
      .subscribe(tokenFilter => {
        this.form.disable({ emitEvent: false }); // disable form to prevent emitting events while patching values
        this.form.patchValue(tokenFilter, { emitEvent: false });
        this.form.enable({ emitEvent: false }); // re-enable form after patching values
      });
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
    this.destroy$.next();
    this.destroy$.complete();
  }
}

@Component({
  selector: 'dhpp-form-tokenContext-help',
  templateUrl: './formTokenContextHelp.html'
})
export class FormTokenContextHelpComponent {}
