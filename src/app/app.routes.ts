import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SearchComponent } from './components/search/search.component';
import { SearchMapComponent } from './components/search-map/search-map.component';

// Route Configuration
const routes: Routes = [
  { path: '', component: SearchComponent },
  { path: 'map', component: SearchMapComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
