import { Component } from '@angular/core';
import { DealershipsService } from '../../services/dealerships.service';

@Component({
  selector: 'search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent {
  location: string;
  results: any[];
  showLoader = false;
  errorMessage: string;
  latitude: number;
  longitude: number;
  radius: number;

  constructor(private dealershipsService: DealershipsService) {}

  updateLocation(event) {
    this.latitude = event.latitude
    this.longitude = event.longitude
    this.radius = event.radius
  }

  search() {
    this.showLoader = true;
    this.dealershipsService.findDealerships(this.latitude, this.longitude, this.radius).subscribe(
      data => {
        this.results = data.dealerships;
        if (!this.results || this.results.length <= 0) {
          this.errorMessage = 'No dealerships available'
        }
      },
      error =>  {
        this.errorMessage = error;
        this.showLoader = false;
      }
    );
  }
}
