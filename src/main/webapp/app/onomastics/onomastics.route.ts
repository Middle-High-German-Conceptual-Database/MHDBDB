import { Routes } from "@angular/router";
import { OnomasticsComponent } from "./onomastics.component";
import { OnomasticsViewComponent } from "./onomastics-view/onomastics-view.component";
import { OnomasticsTreeComponent } from './onomastics-tree/onomastics-tree.component'

export const onomasticsRoutes: Routes = [
  { path: '', component: OnomasticsComponent, children: [
  { path: 'tree' , component: OnomasticsTreeComponent },  
  { path: 'view/:id', component: OnomasticsViewComponent },
      ]}
];
