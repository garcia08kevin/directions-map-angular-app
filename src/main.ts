import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';

if (!navigator.geolocation) {
  alert('Navegador no soporta la Geolizacion');
  throw new Error('Navegador no soporta la Geolizacion');
}

import Mapboxgl from 'mapbox-gl'; // or "const mapboxgl = require('mapbox-gl');"

Mapboxgl.accessToken = 'pk.eyJ1IjoiZ2FyY2lha2V2aW4wMDg0IiwiYSI6ImNsbDh3NGtqZDA2eTIzZG56dzZyMnQ0MW0ifQ.cKg3ntg6DuMdyeYbRJeUJw';

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
