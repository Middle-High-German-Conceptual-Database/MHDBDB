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

const containerElementName = 'reactComponentContainer';

/**
 * <app-react-wrapper [component]="MyReactComponent" [props]="{ prop1: 'value1', prop2: 'value2' }"></app-react-wrapper>
 */
@Component({
  selector: 'dhpp-app-react-wrapper',
  template: `<span #${containerElementName}></span>`,
  encapsulation: ViewEncapsulation.None,
})
export class ReactWrapperComponent implements OnChanges, OnDestroy, AfterViewInit {
  @ViewChild(containerElementName, { static: true }) containerRef!: ElementRef;

  @Output() public componentClick = new EventEmitter<void>();

  // Here we take React component as input
  @Input() component!: React.ComponentType<any>;

  // And also the props for that component
  @Input() props?: any;

  public handleCheckboxSelected() {
    if (this.componentClick) {
      this.componentClick.emit();
      this.render();
    }
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
    if (!this.component) {
      console.error('No React Component provided');
      return;
    }

    ReactDOM.render(
      <React.StrictMode>
        <this.component {...this.props} />
      </React.StrictMode>
      , this.containerRef.nativeElement);
  }
}
