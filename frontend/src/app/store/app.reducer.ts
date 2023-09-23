import { createReducer, on } from '@ngrx/store';
import { increment, decrement, reset, updateLastTreeItem } from './app.actions';

export const initialState = {
  lastTreeItem: ''
};

const _appReducer = createReducer(
  initialState,
  on(updateLastTreeItem, (state, { lastTreeItem }) => ({ ...state, lastTreeItem}))
);

export function appReducer(state, action) {
  return _appReducer(state, action);
}

export const selectLastTreeItem = (state: any) => state.app.lastTreeItem;
