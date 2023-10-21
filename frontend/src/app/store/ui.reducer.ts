import { createFeatureSelector, createSelector, createReducer, on } from '@ngrx/store';
import { closeDialog, showDialog, setProgress, resetProgress } from './ui.actions';

interface UiAppState {
  dialog: {
    open: boolean;
    data: {
      title: string;
      content: string;
    };
  };
  downloadProgress: number; // Represents the percentage of download progress
}

export const initialState: UiAppState = {
  dialog: { open: false, data: { title: '', content: '' } },
  downloadProgress: 0 // Initially, the progress is 0
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
  })),
  on(setProgress, (state, { progress }) => ({
    ...state,
    downloadProgress: progress
  })),
  on(resetProgress, state => ({
    ...state,
    downloadProgress: 0
  }))
);

export const selectUiFeature = createFeatureSelector<UiAppState>('ui');

export const selectDialog = createSelector(
  selectUiFeature,
  (state: UiAppState) => state.dialog
);

export const selectDownloadProgress = createSelector(
  selectUiFeature,
  (state: UiAppState) => state.downloadProgress
);

