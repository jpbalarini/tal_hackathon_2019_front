import { Component, ViewChild, OnInit, Output, Input, EventEmitter, OnChanges } from '@angular/core';
import {} from '@types/googlemaps';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'search-map',
  templateUrl: './search-map.component.html',
  styleUrls: ['./search-map.component.scss']
})
export class SearchMapComponent implements OnInit, OnChanges {
  @ViewChild('googleMap') googleMap: any;
  @Output() location = new EventEmitter<{}>();
  @Output() dealership = new EventEmitter<{}>();
  @Input() places = [];
  @Input() markers: [any];
  @Input() circles: [any];
  initialLocation = new google.maps.LatLng(30.2672, -97.7031);
  map: google.maps.Map;
  googlePlacesService: google.maps.places.PlacesService;
  maxSearchRadius = 50000;
  minSearchRadius = 2000;
  maxCirclesReached = false;
  DEBUG = true;
  map_markers = []

  constructor() {}

  ngOnInit() {
    this.loadMap();
    this.generateMarkers();
  }

  ngOnChanges(changes) {
    if (changes.places && this.places && this.places.length > 0) {
      this.adjustMap(this.places)
    }

    if (changes.markers) {
      this.deleteMarkers()
      this.generateMarkers()
    }
  }

  loadMap() {
    this.map = new google.maps.Map(this.googleMap.nativeElement, {
      center: this.initialLocation,
      zoom: 13,
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

    google.maps.event.addListenerOnce(this.map, 'idle', () => {
      // only the first time the map is loaded
      var bounds = this.map.getBounds();
      this.location.emit(bounds);
    });

    google.maps.event.addListener(this.map, 'dragend', () => {
      var bounds = this.map.getBounds();
      this.location.emit(bounds);
    });
  }

  adjustMap(places) {
    console.log(places);
    const bounds = new google.maps.LatLngBounds();
    places.forEach(function(place) {
      if (!place.geometry) {
        console.log('Returned place contains no geometry');
        return;
      }

      if (place.geometry.viewport) {
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    }.bind(this));

    this.map.fitBounds(bounds);
  }

  deleteMarkers(){
    for(var i=0; i<this.map_markers.length; i++){
      this.map_markers[i].setMap(null);
    }
  }

  generateMarkers() {
    const image = '../../../assets/TAL-marker.png';
    const uniqueMarkers = this.markers.filter((marker, index, self) =>
      index === self.findIndex((t) => (
        t._source.stats.location.lat === marker._source.stats.location.lat &&
        t._source.stats.location.lon === marker._source.stats.location.lon
      ))
    )


    for (let marker of uniqueMarkers) {
      var dealerData = marker.inner_hits.dealer.hits.hits[0]._source.dealer;
      const dealershipMarker = new google.maps.Marker({
        position: { lat: parseFloat(marker._source.stats.location.lat), lng: parseFloat(marker._source.stats.location.lon) },
        map: this.map,
        animation: google.maps.Animation.DROP,
        title: dealerData.name,
        icon: image
      });
      this.map_markers.push(dealershipMarker);
      var contentString = `
        <div class="name">Name: ${dealerData.name}</div>
        <div>Website: ${dealerData.url}</div>
        <div>Address: ${dealerData.address}</div>
        <div>Phone number: ${dealerData.phone_number}</div>
      `
      var infowindow = new google.maps.InfoWindow({
        content: contentString
      });

      dealershipMarker.addListener('click', () => {
        this.dealership.emit({
          routing: marker._routing
        });
        infowindow.open(this.map, dealershipMarker);
      });
    }
  }
}
