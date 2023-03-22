import { Routes } from "@angular/router";
import { TextListComponent } from "./text-list/text-list.component";
import { TextComponent } from "./text.component";

export const textRoutes: Routes = [
  {
        path: '', component: TextComponent, children: [
            { path: 'list', component: TextListComponent }
        ]
  }
];
