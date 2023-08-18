import { Routes } from "@angular/router";
import { PlaceComponent } from "./place.component";
import {PlaceListComponent} from "./place-list/place-list.component";
import {PlaceViewComponent} from "./place-view/place-view.component";

export const placeRoutes: Routes = [
  { path: '', component: PlaceComponent, children: [
  { path: 'list', component: PlaceListComponent },
  { path: 'view/:id', component: PlaceViewComponent }]}
];
