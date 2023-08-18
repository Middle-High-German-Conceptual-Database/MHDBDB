// filter.actions.ts
import { createAction, props } from '@ngrx/store';

export const updateLabel = createAction('[Filter] Update Label', props<{ label: string }>());

export const setLabelActive = createAction('[Filter] Set Label Active', props<{ isLabelActive: boolean }>());

export const setClassFilterActive = createAction('[Filter] Set Class Filter Active', props<{ isClassFilterActive: boolean }>());

export const setSeriesFilterActive = createAction('[Filter] Set Series Filter Active', props<{ isSeriesFilterActive: boolean }>());

export const setConceptsActive = createAction('[Filter] Set Concepts Active', props<{ isConceptsActive: boolean }>());

export const setWorksActive = createAction('[Filter] Set Works Active', props<{ isWorksActive: boolean }>());

export const setAuthorActive = createAction('[Filter] Set Author Active', props<{ isAuthorActive: boolean }>());

export const updateWorks = createAction(
  '[Filter] Update Works',
  props<{ works: any[] }>() // replace any with the correct type
);

export const updateSeries = createAction(
  '[Filter] Update Series',
  props<{ series: any[] }>() // replace any with the correct type
);
