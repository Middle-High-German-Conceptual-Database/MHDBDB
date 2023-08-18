import {Component, Input} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {Subject, Subscription} from 'rxjs';
import {debounceTime, distinctUntilChanged, takeUntil} from 'rxjs/operators';
import {ListHistoryEntry, HistoryEntryStatic} from '../../history.class';
import {HistoryService} from '../../historyService';
import {FilterPosI, OptionsI, QueryParameterI} from '../../mhdbdb-graph.service';

@Component({
  selector: 'dhpp-form-footer',
  templateUrl: './formFooter.html',
  styleUrls: ['./formFooter.scss']
})
export class FormFooterComponent<qT extends QueryParameterI<f, o>, f extends FilterPosI, o extends OptionsI, instanceClass> {
  @Input() routeString: string;
  protected subscriptionHistoryEntry: Subscription;
  protected subscriptionForm: Subscription;
  public he: ListHistoryEntry<qT, f, o, instanceClass>
  public form: FormGroup;
  public historySelect: FormControl;
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
    this.historySelect = this.fb.control(true);

    this.form = this.fb.group({
      historySelect: this.historySelect
    });
    this.form = this.fb.group({})
  }

  reset() {
    this.he.resetQp()
  }

  fromHistory(id: string) {
    this.he.loadQpFromHistory(id)
  }

  search() {
    this.he.update()
  }

  subscribeForm(): Subscription {
    return this.form
      .valueChanges
      .pipe(
        debounceTime(1000),
        distinctUntilChanged()
      )
      .subscribe(
        value => {

        },
        error => {
          console.warn(error)
        }
      )
  }

  subscribeHistory(): Subscription {
    return this.he.history
      .subscribe(
        value => {
          this.history = this.he.getLastQpFromHistory(this._historySize)
        },
        error => {
          console.warn(error)
        }
      )
  }

  ngOnInit() {
    this.historyService.history
      .pipe(takeUntil(this.notifier))
      .subscribe(
        historyMap => {
          this.he = this.historyService.getListHistoryEntry(this.routeString)
          if (this.he) {
            this.initHtmlForm()
            this.subscriptionForm = this.subscribeForm()
            this.subscriptionHistoryEntry = this.subscribeHistory()
            this.notifier.complete()
          }
        }
      )
  }

  ngOnDestroy() {
    if (this.subscriptionForm) {
      this.subscriptionForm.unsubscribe()
    }

    if (this.subscriptionHistoryEntry) {
      this.subscriptionHistoryEntry.unsubscribe()
    }
  }
}
