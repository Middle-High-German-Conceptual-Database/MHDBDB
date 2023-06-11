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

export const initialState: TextQueryParameterI = defaultTextQP;

const _filterReducer = createReducer(
  initialState,
  on(increment, state => ({ ...state, limit: state.limit + 1 })),
  on(decrement, state => ({ ...state, limit: state.limit - 1 })),
  on(reset, state => ({ ...initialState })),
  on(addTokenFilter, (state, { tokenFilter }) => ({
    ...state,
    filter: { ...state.filter, tokenFilters: [...state.filter.tokenFilters, tokenFilter] }
  })),
  on(removeFilter, (state, { filterIndex }) => {
    if (filterIndex >= 0 && filterIndex < state.filter.tokenFilters.length) {
      const newTokenFilters = [...state.filter.tokenFilters];
      newTokenFilters.splice(filterIndex, 1);
      return { ...state, filter: { ...state.filter, tokenFilters: newTokenFilters } };
    }
    return state;
  }),
  on(updateFilter, (state, { filterIndex, newFilter }) => {
    if (filterIndex >= 0 && filterIndex < state.filter.tokenFilters.length) {
      const newTokenFilters = [...state.filter.tokenFilters];
      newTokenFilters[filterIndex] = newFilter;
      return { ...state, filter: { ...state.filter, tokenFilters: newTokenFilters } };
    }
    return state;
  }),
  on(moveTokenFilterUp, (state, { filterIndex }) => {
    if (filterIndex > 0) {
      const newTokenFilters = [...state.filter.tokenFilters];
      const temp = newTokenFilters[filterIndex];
      newTokenFilters[filterIndex] = newTokenFilters[filterIndex - 1];
      newTokenFilters[filterIndex - 1] = temp;
      return { ...state, filter: { ...state.filter, tokenFilters: newTokenFilters } };
    }
    return state;
  }),
  on(moveTokenFilterDown, (state, { filterIndex }) => {
    if (filterIndex < state.filter.tokenFilters.length - 1) {
      const newTokenFilters = [...state.filter.tokenFilters];
      const temp = newTokenFilters[filterIndex];
      newTokenFilters[filterIndex] = newTokenFilters[filterIndex + 1];
      newTokenFilters[filterIndex + 1] = temp;
      return { ...state, filter: { ...state.filter, tokenFilters: newTokenFilters } };
    }
    return state;
  }),
  on(updateFilterById, (state, { filterId, newFilter }) => {
    const index = state.filter.tokenFilters.findIndex(filter => filter.id === filterId);
    if (index >= 0) {
      const newTokenFilters = [...state.filter.tokenFilters];
      newTokenFilters[index] = newFilter;
      return { ...state, filter: { ...state.filter, tokenFilters: newTokenFilters } };
    }
    return state;
  })
);

export function filterReducer(state: TextQueryParameterI | undefined, action: Action) {
  return _filterReducer(state, action);
}

export const selectFilterState = (state: TextQueryParameterI) => state.filter; // Replace 'yourFeatureState' with the name of the feature state that contains the TextQueryParameterI state

export const selectFilter = createSelector(
  selectFilterState,
  (state: any) => state.filter
);

export const selectTokenFilters = createSelector(
  selectFilter,
  (filter: any) => filter.tokenFilters
);

export const selectTokenFilterById = createSelector(
  selectFilter,
  (filter: any, props: { id: string | number }) => filter.tokenFilters.find(filter => filter.id === props.id)
);

/*
this.store.dispatch(addTokenFilter({ tokenFilter: newTokenFilter }));
this.store.dispatch(removeFilter({ filterIndex: indexToRemove }));
this.store.dispatch(updateFilter({ filterIndex: indexToUpdate, newFilter: updatedFilter }));
this.store.dispatch(moveTokenFilterUp({ filterIndex: indexToMove }));
this.store.dispatch(moveTokenFilterDown({ filterIndex: indexToMove }));
this.store.pipe(select(selectTokenFilterById, { id: idToFind })).subscribe(tokenFilter => {
  // Do something with tokenFilter
});
this.store.dispatch(updateFilterById({ filterId: idToUpdate, newFilter: updatedFilter }));
*/
