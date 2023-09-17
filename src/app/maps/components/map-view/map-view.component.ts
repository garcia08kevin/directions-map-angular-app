import { AfterViewInit, Component, ElementRef, ViewChild, inject } from '@angular/core';
import { PlacesService } from '../../services/places.service';
import { Map, Popup, Marker } from 'mapbox-gl';
import { MapService } from '../../services/maps.service';

@Component({
  selector: 'map-view',
  templateUrl: './map-view.component.html',
  styles: [`
  .map-container{
    position: fixed;
    top: 0px;
    right: 0px;
    height: 1000vh;
    width: 100vw;
  }
  `
  ]
})
export class MapViewComponent implements AfterViewInit {
  private placesService = inject(PlacesService);
  private mapService = inject(MapService);

  @ViewChild('mapDiv')
  mapDivElement!: ElementRef

  ngAfterViewInit(): void {

    if (!this.placesService.userLocation) throw Error('Error en el servicio userLocation()')
    const map = new Map({
      container: this.mapDivElement.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: this.placesService.userLocation,
      zoom: 14,
    });

    const popup = new Popup().setHTML(`
      <h6>Aqui estoy</h6>
      <span>Esto es Quito</span>
    `);

    new Marker({ color: 'red' }).setLngLat(this.placesService.userLocation).setPopup(popup).addTo(map);

    this.mapService.setMap(map);
  }

}
