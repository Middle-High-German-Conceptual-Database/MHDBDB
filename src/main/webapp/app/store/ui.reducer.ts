import { createFeatureSelector, createSelector, createReducer, on } from '@ngrx/store';
import { closeDialog, showDialog } from './ui.actions';

interface UiAppState {
  dialog: {
    open: boolean;
    data: {
      title: string;
      content: string;
    };
  };
}

export const initialState: UiAppState = {
  dialog: { open: false, data: { title: '', content: '' } }
};

export const uiReducer = createReducer(
  initialState,
  on(showDialog, (state, { title, content }) => ({
    ...state,
    dialog: { open: true, data: { title, content } }
  })),
  on(closeDialog, state => ({
    ...state,
    dialog: { open: false, data: { title: '', content: '' } }
  }))
);

export const selectUiFeature = createFeatureSelector<UiAppState>('ui');

export const selectDialog = createSelector(
  selectUiFeature,
  (state: UiAppState) => state.dialog
);
