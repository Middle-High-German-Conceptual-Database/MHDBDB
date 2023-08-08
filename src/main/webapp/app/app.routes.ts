import { Routes } from '@angular/router';

import { AppHomeComponent } from 'app/home/home.component';

export const routes: Routes = [
  { path: '', component: AppHomeComponent },
  { path: 'home', component: AppHomeComponent },
  {
    path: 'reference',
    loadChildren: () => import('./reference/reference.module').then(m => m.ReferenceModule),
    runGuardsAndResolvers: 'always'
  },
  {
    path: 'work',
    loadChildren: () => import('./work/work.module').then(m => m.WorkModule),
    runGuardsAndResolvers: 'always'
  },
  {
    path: 'dictionary',
    loadChildren: () => import('./dictionary/dictionary.module').then(m => m.DictionaryModule),
    runGuardsAndResolvers: 'always'
  },
  {
    path: 'concept',
    loadChildren: () => import('./concept/concept.module').then(m => m.ConceptModule),
    runGuardsAndResolvers: 'always'
  },
  {
    path: 'onomastics',
    loadChildren: () => import('./onomastics/onomastics.module').then(m => m.OnomasticsModule),
    runGuardsAndResolvers: 'always'
  },
  {
    path: 'indices/person',
    loadChildren: () => import('./indices/person/person.module').then(m => m.PersonModule),
    runGuardsAndResolvers: 'always'
  },
  {
    path: 'indices/place',
    loadChildren: () => import('./indices/place/place.module').then(m => m.PlaceModule),
    runGuardsAndResolvers: 'always'
  },
  {
    path: 'project',
    loadChildren: () => import('./project/project.module').then(m => m.ProjectModule),
    runGuardsAndResolvers: 'always'
  },
  {
    path: 'text',
    loadChildren: () => import('./text/text.module').then(m => m.TextModule),
    runGuardsAndResolvers: 'always'
  }
  /*{
    path: 'globalSearch',
    loadChildren: () => import('./globalSearch/globalSearch.module').then(m => m.GlobalSearchModule),
    runGuardsAndResolvers: 'always'
  },*/
];
