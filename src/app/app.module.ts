import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { SearchComponent } from './components/search/search.component';
import { SearchMapComponent } from './components/search-map/search-map.component';

import { AppRoutingModule } from './app.routes';


@NgModule({
  declarations: [
    AppComponent,
    SearchComponent,
    SearchMapComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
