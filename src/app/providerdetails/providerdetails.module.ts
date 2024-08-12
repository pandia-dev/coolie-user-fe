import { Component, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrackproviderComponent } from './trackprovider/trackprovider.component';
import { RouterModule, Routes } from '@angular/router';


const routes:Routes=[
  {path:'',component:TrackproviderComponent},
  {path:'trackProvider',component:TrackproviderComponent}
]
@NgModule({
  declarations: [
    TrackproviderComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class ProviderdetailsModule { }
