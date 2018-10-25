import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { FiltersComponent } from './components/filters/filters.component';

import { SearchMapComponent } from './components/search-map/search-map.component';

@NgModule({
  declarations: [
    AppComponent,
    FiltersComponent,
    SearchMapComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
