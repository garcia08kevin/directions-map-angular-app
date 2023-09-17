import { HttpClient, HttpHandler } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { accessToken } from 'mapbox-gl';
import { environments } from 'src/environments/environments';



@Injectable({
  providedIn: 'root'
})
export class DirectionsApiClient extends HttpClient {
  public baseUrl = 'https://api.mapbox.com/directions/v5/mapbox/driving';

  constructor(handler: HttpHandler) {
    super(handler);
  }

  public override get<T>(url: string) {
    url = this.baseUrl + url;

    return super.get<T>(url, {
      params: {
        alternatives: false,
        language: 'es',
        geometries: 'geojson',
        overview: 'full',
        steps: false,
        access_token: environments.apiKey,
      }
    })
  }
}
