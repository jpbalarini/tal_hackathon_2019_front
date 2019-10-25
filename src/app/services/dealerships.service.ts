import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpService } from './http.service';
import { HttpParams } from '@angular/common/http';
import { ResponseContentType } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

@Injectable()
export class DealershipsService {
  private dealershipsUrl = this.http.getApiUrl() + '/stats';

  constructor (private http: HttpService) {}

  findDealerships(topLeft, bottomRight, year, make, model, routing, showStats) {
    let params = new HttpParams();
    params = params.append('top_left', JSON.stringify(topLeft));
    params = params.append('bottom_right', JSON.stringify(bottomRight));
    params = params.append('size', "100");
    if (year) {
      params = params.append('year', year)
    }
    if (make) {
      params = params.append('make', make)
    }
    if (model) {
      params = params.append('model', model)
    }
    if (routing) {
      params = params.append('routing', routing)
    }
    if(showStats){
      params = params.append('show_stats', "true")
    }
    return this.http.get(`${this.dealershipsUrl}`, { params: params }).catch(this.http.handleError)
  }

  export(ids) {
    return this.http.get(`${this.dealershipsUrl}/export.csv?dealership_ids=${ids}`, { responseType: 'text' }).catch(this.http.handleError)
  }
}
