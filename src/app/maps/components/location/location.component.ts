import { Component, inject } from '@angular/core';
import { PlacesService } from '../../services/places.service';
import { MapService } from '../../services/maps.service';

@Component({
  selector: 'location',
  templateUrl: './location.component.html',
  styles: [`
  button{
    position: fixed;
    top: 20px;
    right: 20px;
  }
  `
  ]
})
export class LocationComponent {
  private mapService = inject(MapService);
  private placesService = inject(PlacesService);

  goToMyLocation(){
    if (!this.placesService.userLocation) throw Error('Error en el servicio userLocation()')
    this.mapService.flyTo(this.placesService.userLocation);
  }
}
