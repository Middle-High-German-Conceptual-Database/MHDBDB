import { Routes } from "@angular/router";
import { ProjectComponent } from "./project.component";

export const projectRoutes: Routes = [
  { path: '', component: ProjectComponent, children: [
    { path: 'list', component: ProjectComponent },
    { path: 'view/:id', component: ProjectComponent }
    ]}
];


