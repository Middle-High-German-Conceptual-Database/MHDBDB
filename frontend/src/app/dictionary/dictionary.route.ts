import { Routes } from "@angular/router";
import { DictionaryListComponent } from "./dictionary-list/dictionary-list.component";
import { DictionaryViewComponent } from "./dictionary-view/dictionary-view.component";
import { DictionaryComponent } from "./dictionary.component";
import { DictionaryEditComponent } from "./edit/edit.component";

export const dictionaryRoutes: Routes = [
    {
        path: '', component: DictionaryComponent, children: [
            { path: 'list', component: DictionaryListComponent },
            { path: 'view/:id', component: DictionaryViewComponent },
            { path: 'edit/:id', component: DictionaryEditComponent },
        ]
    }
];
