import { Component } from '@angular/core';
import { DealershipsService } from '../../services/dealerships.service';
import {} from '@types/googlemaps';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent {
  location: string;
  results: any[] = [];
  circles: any[] = [];
  errorMessage: string;
  latitude: number;
  longitude: number;
  radius: number;
  filters = {};
  places = [];
  yearFilter: string = "";
  makeFilter: string = "";
  modelFilter: string = "";
  currentBounds = new google.maps.LatLngBounds(
    new google.maps.LatLng(30.241621608162028, -97.81038836059571),
    new google.maps.LatLng(30.291289492539125, -97.59066179809571)
  );
  currentRouting = null;


  constructor(private dealershipsService: DealershipsService, private spinner: NgxSpinnerService) {}


  ngOnInit() {
    var mapInput: HTMLInputElement = <HTMLInputElement> document.getElementById('map-location');
    var searchBox = new google.maps.places.SearchBox(mapInput, {
      bounds: this.currentBounds
    });

    searchBox.addListener('places_changed', function() {
      var places = searchBox.getPlaces();
      if (places.length == 0) {
        return;
      }

      console.log(places[0].geometry.location.lat())
      console.log(places[0].geometry.location.lng())
      this.places = places;
    }.bind(this));
  }

  filter(){
    this.search(this.currentBounds)
  }

  filterByDealership(routing){
    this.currentRouting = routing;
    this.search(this.currentBounds)
  }

  search(bounds) {
    this.currentBounds = bounds
    this.spinner.show();
    this.results = []
    this.dealershipsService.findDealerships(
      this.boundsToPoints(bounds).topLeft,
      this.boundsToPoints(bounds).bottomRight,
      this.yearFilter, this.makeFilter, this.modelFilter, this.currentRouting)
    .subscribe(
      data => {
        this.results = data.transactions.hits;
        this.spinner.hide();
      },
      error =>  {
        this.errorMessage = error;
        this.spinner.hide();
      }
    );
  }

  boundsToPoints(bounds) {
    var topLeft = {
      lat: bounds.getNorthEast().lat(),
      lon: bounds.getSouthWest().lng()
    }
    var bottomRight = {
      lat: bounds.getSouthWest().lat(),
      lon: bounds.getNorthEast().lng()
    }
    return {topLeft: topLeft, bottomRight: bottomRight}
  }

  randomCondition(){
    var conditions = ["Used", "New"]
    var randomIndex = Math.floor(Math.random() * conditions.length);
    return conditions[randomIndex];
  }

  downloadCsv() {
    const ids = this.results.map(dealer => dealer.id);
    this.dealershipsService.export(ids).subscribe(
      data => this.downloadFile(data)
    );
  }

  downloadFile(data: Response) {
    let blob = new Blob([data], { type: 'text/csv' });
    let url = window.URL.createObjectURL(blob);

    if(navigator.msSaveOrOpenBlob) {
        navigator.msSaveBlob(blob, 'dealers.csv');
    } else {
        let a = document.createElement('a');
        a.href = url;
        a.download = 'dealers.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
    window.URL.revokeObjectURL(url);
  }
}
