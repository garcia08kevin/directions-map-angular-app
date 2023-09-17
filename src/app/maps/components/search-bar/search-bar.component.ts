import { Component, inject } from '@angular/core';
import { PlacesService } from '../../services/places.service';

@Component({
  selector: 'search-bar',
  templateUrl: './search-bar.component.html',
  styles: [`
    .search-container{
      position: fixed;
      top: 20px;
      left: 20px;
      width: 250px;
      background-color: white;
      padding:5px;
      box-shadow: 0px 10px 10px rgba(0,0,0,0.1);
      border-radius: 5px;
      border: 1px solid rgba(0,0,0,0.1);
    }
  `
  ]
})
export class SearchBarComponent {
  private placesService= inject(PlacesService);
  private debounceTimer?: NodeJS.Timeout;
    onQueryChanged(query: string){
      if(this.debounceTimer) clearTimeout(this.debounceTimer);

      this.debounceTimer = setTimeout(() => {
        this.placesService.getPlacesByQuery(query);
      }, 1000)
    }
}
