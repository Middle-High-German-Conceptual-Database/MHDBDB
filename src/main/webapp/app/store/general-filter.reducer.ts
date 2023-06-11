import { createReducer, on, Action, createSelector } from '@ngrx/store';
import {
  increment,
  decrement,
  reset,
  addTokenFilter,
  moveTokenFilterUp,
  moveTokenFilterDown,
  removeFilter,
  updateFilter,
  updateFilterById
} from './filter.actions';
import { TextQueryParameterI, defaultTextQP } from 'app/reference/reference.service';
import { FilterClassExtendedI } from 'app/shared/mhdbdb-graph.service';

export const defaultFilterClassExtended = {
  label: '',
  isLabelActive: false,
  isClassFilterActive: false,
  isSeriesFilterActive: false,
  isConceptsActive: false,
  isWorksActive: false,
  works: [],
  series: []
};

export const initialState: FilterClassExtendedI = defaultFilterClassExtended;

const _generalFilterReducer = createReducer(initialState);

export function generalFilterReducer(state: FilterClassExtendedI | undefined, action: Action) {
  return _generalFilterReducer(state, action);
}
