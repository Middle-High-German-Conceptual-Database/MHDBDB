import { createAction, props } from '@ngrx/store';
import { ElectronicText } from 'app/reference/reference.class';

export const storeReferenceObject = createAction(
  '[Reference] Store Reference Data',
  props<{ data: any }>()
);

export const storeInstances = createAction(
    '[Reference] Store Reference Instances',
    props<{ data: ElectronicText[] }>()
  );
