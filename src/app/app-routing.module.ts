import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LandingBodyComponent } from './landing-body/landing-body.component';
import { MapsComponent } from './maps/maps.component';
import { CovidComponent } from './covid/covid.component';


const routes: Routes = [
  { path: '', component: LandingBodyComponent },
  { path: 'covid', component: CovidComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
