import { Component, ViewChild, OnInit, Output, Input, EventEmitter } from '@angular/core';
import {} from '@types/googlemaps';

@Component({
  selector: 'search-map',
  templateUrl: './search-map.component.html',
  styleUrls: ['./search-map.component.scss']
})
export class SearchMapComponent implements OnInit {
  @ViewChild('googleMap') googleMap: any;
  @Output() location = new EventEmitter<{}>();
  @Input() markers: [any];
  initialLocation = new google.maps.LatLng(-34.906836, -56.180388);
  map: google.maps.Map;
  googlePlacesService: google.maps.places.PlacesService;
  maxSearchRadius = 50000;
  minSearchRadius = 500;
  maxCirclesReached = false;

  constructor() {}

  ngOnInit() {
    this.loadMap();
    this.generateMarkers();
  }

  loadMap() {
    this.map = new google.maps.Map(this.googleMap.nativeElement, {
      center: this.initialLocation,
      zoom: 14,
      styles: [
        {
          featureType: 'poi',
          stylers: [{ visibility: 'off' }]
        },
        {
          featureType: 'transit.station',
          stylers: [{ visibility: 'off' }]
        }
      ]
    });
    this.setCircleEvent();
  }

  setCircleEvent() {
    this.map.addListener('click', (event) => {
      if (this.maxCirclesReached) return;
      this.maxCirclesReached = true;

      const searchArea = new google.maps.Circle({
        map: this.map,
        center: event.latLng,
        radius: 500,
        draggable: true,
        editable: true,
        strokeColor: '#53af7e',
        strokeOpacity: 0.8,
        strokeWeight: 1,
        fillColor: '#53af7e',
        fillOpacity: 0.3
      });

      this.location.emit({
        position: searchArea.getBounds(),
        radius: searchArea.getRadius(),
      });

      google.maps.event.addListener(searchArea, 'radius_changed', () => {
        if (searchArea.getRadius() > this.maxSearchRadius) {
          searchArea.setRadius(this.maxSearchRadius);
        }
        if (searchArea.getRadius() < this.minSearchRadius) {
          searchArea.setRadius(this.minSearchRadius);
        }

        this.location.emit({
          position: searchArea.getBounds(),
          radius: searchArea.getRadius(),
        });
      });
    });
  }

  generateMarkers() {
    const image = '../../../assets/TAL-marker.png';
    for (let marker of this.markers) {
      const dealershipMarker = new google.maps.Marker({
        position: {lat: marker.latitude, lng: marker.longitude},
        map: this.map,
        animation: google.maps.Animation.DROP,
        title: 'Hello World!',
        icon: image
      });
    }
  }
}
