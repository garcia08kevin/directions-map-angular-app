import { Component, inject } from '@angular/core';
import { PlacesService } from '../../services/places.service';
import { MapService } from '../../services/maps.service';
import { Feature } from '../../interfaces/places';

@Component({
  selector: 'search-results',
  templateUrl: './search-results.component.html',
  styles: [`
  .pointer{
    cursor:pointer;
  }
  a{
    fornt-size:12px;
  }
  `
  ]
})
export class SearchResultsComponent {
  private placesService= inject(PlacesService);
  private mapService = inject(MapService);
  public selectedId: string = '';

  get isLoadingPlaces(){
    return this.placesService.isLoading
  }

  get places(){
    return this.placesService.places
  }

  goToLocation(place : Feature){
    this.selectedId = place.id;
    const [longitude,latitude] = place.center;
    this.mapService.flyTo([longitude,latitude]);
  }

  getDirections(place:Feature){
    if(!this.placesService.userLocation) throw Error('No hay ubicacion actual')
    this.placesService.deletePlaces();
    const start = this.placesService.userLocation;
    const end = place.center as [number, number];
    this.mapService.getRouteBetweenPoints(start, end);
  }
}
