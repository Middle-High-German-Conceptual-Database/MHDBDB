import { createAction, props } from '@ngrx/store';

export const changeLanguage = createAction('[Language] Change Language', props<{ language: string }>());
