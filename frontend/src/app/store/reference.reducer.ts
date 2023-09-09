import { createReducer, on } from '@ngrx/store';
import * as referenceActions from './reference.actions';

export const initialState: any = {};

export const referenceReducer = createReducer(
  initialState,
  on(referenceActions.storeReferenceObject, (state, { data }) => ({ ...state, ...data })),
  on(referenceActions.storeInstances, (state, { data }) => ({ ...state, ...data })),
);
