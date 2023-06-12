import { createAction, props } from '@ngrx/store';
import { TokenFilterI } from 'app/reference/referencePassage.service';

export const increment = createAction('[Counter Component] Increment');
export const decrement = createAction('[Counter Component] Decrement');
export const reset = createAction('[Counter Component] Reset');

export const addTokenFilter = createAction('[Filter] Add Token Filter', props<{ tokenFilter: TokenFilterI }>());

export const removeFilter = createAction('[Filter] Remove Filter', props<{ filterIndex: number }>());

export const updateFilter = createAction('[Filter] Update Filter', props<{ filterIndex: number; newFilter: TokenFilterI }>());

export const moveTokenFilterUp = createAction('[Filter] Move Token Filter Up', props<{ filterIndex: number }>());

export const moveTokenFilterDown = createAction('[Filter] Move Token Filter Down', props<{ filterIndex: number }>());

export const updateFilterById = createAction(
  '[Filter] Update Filter By ID',
  props<{ filterId: string | number; newFilter: TokenFilterI }>()
);

export const updateRelation = createAction('[Filter Component] Update Relation', props<{ filterId: string; relation: string }>());
