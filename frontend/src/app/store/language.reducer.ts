import { createReducer, on } from '@ngrx/store';
import { changeLanguage } from './language.action';
import { createSelector } from '@ngrx/store';

export interface AppState {
  language: string;
}

export const initialState: string = navigator.language.replace(/-.*/g, '');

export const languageReducer = createReducer(initialState, on(changeLanguage, (state, { language }) => language));

export const selectFeature = (state: AppState) => state.language;

export const selectLanguage = createSelector(
  selectFeature,
  (state: string) => state
);
