import { Routes } from "@angular/router";
import { PersonComponent } from "./person.component";
import {PersonListComponent} from "./person-list/person-list.component";
import {PersonViewComponent} from "./person-view/person-view.component";

export const personRoutes: Routes = [
  { path: '', component: PersonComponent, children: [
  { path: 'list', component: PersonListComponent },
  { path: 'view/:id', component: PersonViewComponent }]}
];
