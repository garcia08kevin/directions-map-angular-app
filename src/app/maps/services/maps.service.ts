import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Map, LngLatLike, Marker, Popup, LngLatBounds, AnySourceData } from 'mapbox-gl';
import { Feature } from '../interfaces/places';
import { DirectionsApiClient } from '../api/directionsApiClient';
import { DirectionsResponse, Route } from '../interfaces/directions';

@Injectable({ providedIn: 'root' })
export class MapService {
  private map?: Map;
  private markers: Marker[] = [];

  directionsApiClient = inject(DirectionsApiClient);

  get isMapReady() {
    return !!this.map
  }

  setMap(map: Map) {
    this.map = map;
  }

  flyTo(coords: LngLatLike) {
    if (!this.isMapReady) throw Error('El mapa aun no esta listo');

    this.map?.flyTo({
      zoom: 14,
      center: coords
    });
  }

  createMarkersFromPlaces(places: Feature[], userLocation: [number, number]) {
    if (!this.map) throw Error('El mapa aun no esta listo');
    this.markers.forEach(marker => marker.remove());
    const newMarkers = [];
    for (const place of places) {
      const [lng, lat] = place.center;
      const popup = new Popup().setHTML(`
      <h6>${place.text}</h6>
      <span>${place.place_name}</span><h6>${place.text}</h6>
      `)
      const newMarker = new Marker().setLngLat([lng, lat]).setPopup(popup).addTo(this.map);
      newMarkers.push(newMarker);
      this.markers = newMarkers;
      if (places.length === 0) return;
      //Limites del mapa
      const bounds = new LngLatBounds()
      newMarkers.forEach(marker => bounds.extend(marker.getLngLat()));
      bounds.extend(userLocation);
      this.map.fitBounds(bounds, { padding: 200 });
    }
  }

  getRouteBetweenPoints(start: [number, number], end: [number, number]) {
    this.directionsApiClient.get<DirectionsResponse>(`/${start.join(',')};${end.join(',')}`).subscribe(res => {
      this.drawPolyline(res.routes[0]);
    })
  }

  private drawPolyline(route: Route) {
    if (!this.map) throw Error('Mapa no inicialiado');
    const coords = route.geometry.coordinates;
    const bounds = new LngLatBounds();
    coords.forEach(([lng, lat]) => {
      bounds.extend([lng, lat])
    });
    this.map?.fitBounds(bounds, { padding: 200 });

    const sourceData: AnySourceData = {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: coords
            }
          }
        ]
      }
    }

    if(this.map.getLayer('RouteString')){
      this.map.removeLayer('RouteString');
      this.map.removeSource('RouteString');
    }

    this.map.addSource('RouteString', sourceData);
    this.map.addLayer({
      id: 'RouteString',
      type: 'line',
      source: 'RouteString', //debe ser el mismo del source
      layout: {
        'line-cap': 'round',
        'line-join': 'round'
      },
      paint: {
        'line-color': 'black',
        'line-width': 3
      }
    });
  }

}
