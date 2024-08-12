import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Route, Router } from '@angular/router';
import { MapboxService } from '../mapbox.service';
import { ToastrsService } from '../toastrs.service';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrl: './address.component.css'
})
export class AddressComponent {

 private responseAddress:any;
  constructor(private readonly location:Location,
              private readonly router:Router,
              private readonly http:HttpClient,
              private readonly mapBoxService:MapboxService,
              private readonly toasterService:ToastrsService
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
        this.responseAddress=response;
        if (response ) {
          response.map((element: any) => {
            const add = element.address + ', ' + element.landmark + ', ' + element.city + ', ' + element.state + ', ' + element.pincode;
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
  deleteAddress(index:any){
    this.toasterService.showSuccess('address deleted sucessfully', 'Toastr fun!')
    console.log(this.responseAddress[index]._id);
    const id=this.responseAddress[index]._id
    const api=`https://api.coolieno1.in/v1.0/users/user-address/${id}`;
    this.http.delete(api).subscribe({
      next:(response)=>{
        console.log(response);
        
        this.address=[];
        this.getAddress()
      },
      error:(err)=>{
        console.log(err);
      }
    })
  }
}
