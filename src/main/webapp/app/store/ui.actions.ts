import { createAction, props } from '@ngrx/store';

export const showDialog = createAction('[Dialog] Show', props<{ title: string; content: string }>());

export const closeDialog = createAction('[Dialog] Close');
