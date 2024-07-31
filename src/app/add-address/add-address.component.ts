import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MapboxService } from '../mapbox.service';
import { BookingsService } from '../bookings.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-add-address',
  templateUrl: './add-address.component.html',
  styleUrl: './add-address.component.css'
})
export class AddAddressComponent implements OnInit{
  address!: FormGroup;
  currentAddress!:FormGroup;
  mobile:any;
  name:any;


  navToBack(){
    this.location.back();
  }
  constructor(private fb: FormBuilder, 
    private mapBoxService: MapboxService,
    private bookingService:BookingsService,
    private http:HttpClient,
    private router:Router,
    private location:Location
  )
   { 
    
    this.coordinates = this.mapBoxService.currentLocation;
   this.address=this.fb.group({
      userId:localStorage.getItem('userId'),
      username:'',
      bookingType:'self',
      mobileNumber:'',
      address:'',
      city:'',
      landmark:'',
      state:'',
      pincode:'',
      latitude:this.coordinates[1],
      longitude:this.coordinates[0]
    })
   }


   ngOnInit(): void {
    
   }
  coordinates: any = [];

 async getCurrentAddress() {
  //  this.mapBoxService.initializeMap('mapContainer');
    
   this.getCurrentPlaceName();
  }

  getCurrentPlaceName() {
    
    console.log(this.coordinates);
    this.mapBoxService.getPlaceNameFromCoordinates(this.coordinates).subscribe(
      (response) => {
        console.log(response);
        this.assignValues(response)
      },
      (err) => {
        console.error('Error fetching place name:', err);
      }
    );
  }

  useCurentLocation:boolean=false
  assignValues(address:any){
    this.useCurentLocation=!this.useCurentLocation;
   this.currentAddress=this.fb.group({
    username:'',
    hno:'',
    address:address
   
  })
  }
  saveAddress(){
    console.log(this.bookingService.name,this.bookingService.phoneNumber);
    
    this.address.value.mobileNumber=this.bookingService.phoneNumber;
    console.log(this.address.value);

    const api='https://api.coolieno1.in/v1.0/users/user-address';
    this.http.post(api,this.address.value).subscribe({
      next:(response: any)=>{
        console.log(response)
        alert("Address added sucessfully")
        this.router.navigate(['address'])
      },
      error:(err: any)=>{
        console.log(err);
        alert("some thing went wrong")
      }
  })
  
  }
  saveCurrentAddress(){
    console.log(this.currentAddress.value);
  }
}
