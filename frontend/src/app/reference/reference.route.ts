import { Routes } from "@angular/router";
import { TextListComponent } from "./reference-list/reference-list.component";
import { TextComponent } from "./reference.component";

export const textRoutes: Routes = [
  {
        path: '', component: TextComponent, children: [
            { path: 'list', component: TextListComponent }
        ]
  }
];
