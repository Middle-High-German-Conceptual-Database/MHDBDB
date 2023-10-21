import { createAction, props } from '@ngrx/store';

export const showDialog = createAction('[Dialog] Show', props<{ title: string; content: string }>());

export const closeDialog = createAction('[Dialog] Close');

export const setProgress = createAction(
    '[UI] Set Download Progress',
    props<{ progress: number }>()
  );
  
  export const resetProgress = createAction('[UI] Reset Download Progress');
  