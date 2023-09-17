import { Injectable, inject, signal } from '@angular/core';
import { Feature, PlacesResponse } from '../interfaces/places';
import { PlacesApiClient } from '../api/placesApiClient';
import { MapService } from './maps.service';

@Injectable({ providedIn: 'root' })
export class PlacesService {
  private mapService = inject(MapService);

  public isLoading: boolean = false;
  public places: Feature[] = [];
  public userLocation?: [number, number];
  private http = inject(PlacesApiClient);

  get isUserLocationRead(): boolean {
    return !!this.userLocation;
  }

  constructor() {
    this.getUserLocation();
  }

  public getUserLocation(): Promise<[number, number]> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(({ coords }) => {
        this.userLocation = [coords.longitude, coords.latitude];
        resolve(this.userLocation!);
      },
        (err) => {
          alert('No se pudo obtener la geolocalizacion')
          console.log(err);
          reject();
        });
    })
  }

  getPlacesByQuery(query: string = '') {
    if(query.length === 0){
      this.places = [];
      this.isLoading = false;
      return;
    }
    if(!this.userLocation) throw Error('No se encontro la ubicacion')
    this.isLoading = true;
    this.http.get<PlacesResponse>(`/${query}.json`, {
      params: {
        proximity: this.userLocation.join(',')
      }
    }).
      subscribe(({features}) => {
        this.isLoading = false;
        this.places = features;
        this.mapService.createMarkersFromPlaces(this.places, this.userLocation!);
      });
  }

  deletePlaces(){
    this.places = [];
  }

}
