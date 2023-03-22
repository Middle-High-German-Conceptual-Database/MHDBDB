import { Routes } from "@angular/router";
import { WorkComponent } from "./work.component";
import {WorkListComponent} from "./work-list/work-list.component";
import {WorkViewComponent} from "./work-view/work-view.component";

export const workRoutes: Routes = [
  { path: '', component: WorkComponent, children: [
    { path: 'list', component: WorkListComponent },
    { path: 'view/:id', component: WorkViewComponent }
    ]}
];


