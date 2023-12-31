import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MapsModule } from './maps/maps.module';

const routes: Routes = [
  {
    path: 'map',
    loadChildren: () => import('./maps/maps.module').then(m => m.MapsModule)
  },
  {
    path: '**',
    redirectTo: 'map'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
