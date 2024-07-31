import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Route, Router } from '@angular/router';
import { MapboxService } from '../mapbox.service';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrl: './address.component.css'
})
export class AddressComponent {

  constructor(private location:Location,
              private router:Router,
              private http:HttpClient,
              private mapBoxService:MapboxService
  ){
    this.mapBoxService.initializeMap('mapContainer');
    this.getAddress();
  }
  navToBack(){
    this.location.back();
  }
  address:any[]=[]
   
  getAddress(){
    const userId=localStorage.getItem('userId')
    const api=`https://api.coolieno1.in/v1.0/users/user-address/${userId}`
    this.http.get<any>(api).subscribe(
      (response)=>{
        console.log(response);
        if (response ) {
          response.map((element: any) => {
            const add = element.address + ',' + element.landmark + ',' + element.city + ',' + element.state + ',' + element.pincode;
            this.address.push({add});
          });
        } else {
          console.error('Response array is undefined or null');
        }
        console.log(this.address);
      }
    )
  }
  navToAddAddress(){
    this.router.navigate(['addAddress']);
  }
}
