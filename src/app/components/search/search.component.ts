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
  currentLocation = null;


  constructor(private dealershipsService: DealershipsService, private spinner: NgxSpinnerService) {}


  ngOnInit() {
    var mapInput: HTMLInputElement = <HTMLInputElement> document.getElementById('map-location');
    var defaultBounds = new google.maps.LatLngBounds(
      new google.maps.LatLng(-34.881836, -56.130388),
      new google.maps.LatLng(-34.931836, -56.230388)
    );

    var searchBox = new google.maps.places.SearchBox(mapInput, {
      bounds: defaultBounds
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

  updateLocation(event) {
    this.latitude = event.position.lat();
    this.longitude = event.position.lng();
    this.radius = event.radius;
  }

  filter(){
    console.log(this.yearFilter)
    this.search(this.currentLocation)
  }

  search(location) {
    this.currentLocation = location
    this.spinner.show();
    this.results = []
    this.dealershipsService.findDealerships(location.topLeft, location.bottomRight, this.yearFilter).subscribe(
      data => {
        this.results = data.transactions.hits;
        console.log("RESULTS!!!")
        console.log(this.results);
        this.spinner.hide();
      },
      error =>  {
        this.errorMessage = error;
        this.spinner.hide();
      }
    );
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
