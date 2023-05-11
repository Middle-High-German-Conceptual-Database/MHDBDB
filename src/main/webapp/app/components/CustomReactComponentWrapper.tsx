import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {TreeViewComponent} from './TreeViewComponent';
import {WorkService} from "app/work/work.service";
import {SeriesClass} from "app/work/work.class";


const containerElementName = 'customReactComponentContainer';

@Component({
  selector: 'dhpp-app-my-component',
  template: `<span #${containerElementName}></span>`,
  // styleUrls: [''],
  encapsulation: ViewEncapsulation.None,
})
export class CustomReactComponentWrapperComponent implements OnChanges, OnDestroy, AfterViewInit {
  @ViewChild(containerElementName, { static: true }) containerRef!: ElementRef;

  @Output() public componentClick = new EventEmitter<void>();

  public items: any;

  seriesList: SeriesClass[] = [];

  constructor(public workService: WorkService) {
    this.update = this.update.bind(this);

    this.workService.getSeriesParentList().then(
      data => {
        this.items = data[0].map(item => {
          return { id: item.id, label: item.label, checked: false, child: [] };
        });

        this.render();
        }
    )

    /* this.items = [{ id: '1', name: 'Epik, Lyrik und Dramatik', checked: false, child: [
        { id: '11', name: 'Epik', checked: false, child: [
            { id: '111', name: 'Erzählende Literatur', checked: false, child: [] },
          ] },
        { id: '12', name: 'Gedichte', checked: false, child: [
            { id: '121', name: 'Romantik', checked: false, child: [
                { id: '122', name: 'Lyrik', checked: false, child: [] },
              ] },
          ] },
      ] }, { id: '2', name: 'Wissensliteratur und Gebrauchsliteratur', checked: false, child: [

      ]}]; */

  }

  public handleCheckboxSelected() {
    if (this.componentClick) {
      this.componentClick.emit();
      this.render();
    }
  }

  public findAndUpdate1(items, id, checkedValue) {
    const newItems = items.map((item) => {
      if (item.child && item.child.length > 0) {
        // Recursive call should be inside the condition where the item has children
        return {...item, child: this.findAndUpdate1(item.child, id, checkedValue)};
      } else {
        return {...item, checked: checkedValue};
      }
    });

    return newItems;
  };

   public findAndUpdate(items, id, checked, newValues) {
    const newItems = items.map((item) => {
      if (item.id === id) {
        if (item.child && item.child.length > 0) {
          return {...item, child: this.findAndUpdate1(item.child, id, checked)};
        } else {
          return {...item, checked: checked, child: newValues};
        }
      } else if (item.child && item.child.length > 0) {
        // Recursive call should be inside the condition where the item has children
        return { ...item, child: this.findAndUpdate(item.child, id, checked, newValues) };
      } else {
        return { ...item };
      }
    });

    return newItems;
  };


  public update(values, id, checked) {
    this.items = values;

    // Update childs
    this.workService.getSeriesList(id).then(
      data => {
        this.items = this.findAndUpdate(this.items, id, checked, data[0]);
        this.render();
      }
    )

    this.render();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.render();
  }

  ngAfterViewInit() {
    this.render();
  }

  ngOnDestroy() {
    ReactDOM.unmountComponentAtNode(this.containerRef.nativeElement);
  }

  private render() {
    const { items } = this;

    ReactDOM.render(
      <React.StrictMode>
        <div>
          <TreeViewComponent items={items} onClick={this.update} />
        </div>
      </React.StrictMode>
      , this.containerRef.nativeElement);
  }
}
