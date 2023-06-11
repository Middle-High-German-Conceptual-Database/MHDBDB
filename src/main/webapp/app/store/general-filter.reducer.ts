import { createReducer, on, Action, createSelector } from '@ngrx/store';

import {
  updateLabel,
  setLabelActive,
  setClassFilterActive,
  setSeriesFilterActive,
  setConceptsActive,
  setWorksActive,
  setAuthorActive,
  updateWorks,
  updateSeries
} from './general-filter.actions';

import { FilterClassExtendedI } from 'app/shared/mhdbdb-graph.service';

export const defaultFilterClassExtended = {
  label: '',
  isLabelActive: false,
  isClassFilterActive: false,
  isSeriesFilterActive: false,
  isConceptsActive: false,
  isWorksActive: false,
  isAuthorActive: false,
  works: [],
  series: []
};

export const initialState: FilterClassExtendedI = defaultFilterClassExtended;

const _generalFilterReducer = createReducer(
  initialState,
  on(updateLabel, (state, { label }) => ({ ...state, label })),
  on(setLabelActive, (state, { isLabelActive }) => ({ ...state, isLabelActive })),
  on(setClassFilterActive, (state, { isClassFilterActive }) => ({ ...state, isClassFilterActive })),
  on(setSeriesFilterActive, (state, { isSeriesFilterActive }) => ({ ...state, isSeriesFilterActive })),
  on(setConceptsActive, (state, { isConceptsActive }) => ({ ...state, isConceptsActive })),
  on(setWorksActive, (state, { isWorksActive }) => ({ ...state, isWorksActive })),
  on(setAuthorActive, (state, { isAuthorActive }) => ({ ...state, isAuthorActive })),
  on(updateWorks, (state, { works }) => ({ ...state, works })),
  on(updateSeries, (state, { series }) => ({ ...state, series }))
);

export function generalFilterReducer(state: FilterClassExtendedI | undefined, action: Action) {
  return _generalFilterReducer(state, action);
}

export const selectFilterClassExtended = (state: any) => state.generalFilter;

export const selectLabel = createSelector(
  selectFilterClassExtended,
  filterClassExtended => filterClassExtended.label
);

export const selectIsLabelActive = createSelector(
  selectFilterClassExtended,
  filterClassExtended => filterClassExtended.isLabelActive
);

export const selectIsClassFilterActive = createSelector(
  selectFilterClassExtended,
  filterClassExtended => filterClassExtended.isClassFilterActive
);

export const selectIsSeriesFilterActive = createSelector(
  selectFilterClassExtended,
  filterClassExtended => filterClassExtended.isSeriesFilterActive
);

export const selectIsConceptsActive = createSelector(
  selectFilterClassExtended,
  filterClassExtended => filterClassExtended.isConceptsActive
);

export const selectIsWorksActive = createSelector(
  selectFilterClassExtended,
  filterClassExtended => filterClassExtended.isWorksActive
);

export const selectWorks = createSelector(
  selectFilterClassExtended,
  filterClassExtended => filterClassExtended.works
);

export const selectIsAuthorActive = createSelector(
  selectFilterClassExtended,
  filterClassExtended => filterClassExtended.isAuthorActive
);

export const selectSeries = createSelector(
  selectFilterClassExtended,
  filterClassExtended => filterClassExtended.series
);
