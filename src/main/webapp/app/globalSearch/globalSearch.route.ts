import { Routes } from "@angular/router";
import { GlobalSearchComponent } from "./globalSearch.component";
import { GlobalSearchListComponent } from "./globalSearch-list/globalSearch-list.component";

export const globalSearchRoutes: Routes = [
    {
        path: '', component: GlobalSearchComponent, children: [
            { path: 'list', component: GlobalSearchListComponent }
        ]
    }
];


