import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { SearchComponent } from './components/search/search.component';

import { AppRoutingModule }   from './app.routes';
import { FormsModule } from '@angular/forms';

import { HttpService } from './services/http.service';
import { DealershipsService } from './services/dealerships.service';

@NgModule({
  declarations: [
    AppComponent,
    SearchComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [
    DealershipsService,
    HttpService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
