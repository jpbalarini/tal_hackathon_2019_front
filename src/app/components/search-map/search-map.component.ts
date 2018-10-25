import { Component, ViewChild } from '@angular/core';
import { } from '@types/googlemaps';

@Component({
  selector: 'search-map',
  templateUrl: './search-map.component.html',
  styleUrls: ['./search-map.component.scss']
})

export class SearchMapComponent {
  @ViewChild('googleMap') googleMap: any;
  initialLocation = new google.maps.LatLng(-34.906836, -56.180388);
  map: google.maps.Map;
  googlePlacesService: google.maps.places.PlacesService;
}
