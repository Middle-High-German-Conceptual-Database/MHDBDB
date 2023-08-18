import { Routes } from "@angular/router";
import { ConceptComponent } from "./concept.component";
import { ConceptListComponent } from "./concept-list/list.component";
import { ConceptViewComponent } from "./concept-view/concept-view.component";
import { ConceptTreeComponent } from './concept-tree/concept-tree.component'

export const conceptRoutes: Routes = [
  { path: '', component: ConceptComponent, children: [
  { path: 'tree' , component: ConceptTreeComponent },
  { path: 'list', component: ConceptListComponent },
  { path: 'view/:id', component: ConceptViewComponent },
      ]}
];
