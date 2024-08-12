import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MapboxService } from '../mapbox.service';
import { BookingsService } from '../bookings.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { map, Observable, of } from 'rxjs';
import { ToastrsService } from '../toastrs.service';

@Component({
  selector: 'app-add-address',
  templateUrl: './add-address.component.html',
  styleUrl: './add-address.component.css'
})
export class AddAddressComponent implements OnInit{
  public address!: FormGroup;
  public currentAddress!:FormGroup;
  // mobile:any;
  // name:any;


  navToBack(){
    this.location.back();
  }
  constructor(private fb: FormBuilder, 
    private readonly mapBoxService: MapboxService,
    private readonly bookingService:BookingsService,
    private readonly http:HttpClient,
    private readonly router:Router,
    private readonly location:Location,
    private readonly toasteServe:ToastrsService
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
        this.addressResponse=response;
        this.formatAddressData(response);
        
      },
      (err) => {
        console.error('Error fetching place name:', err);
      }
    );
   
  }

 
  formatAddressData(data: any) {
    const formattedAddress = {
      address: '',
      city: '',
      landmark: '',
      state: '',
      pincode: '',
    };
  
    // Use reduce to populate the formattedAddress based on place_type
    for (let i = 0; i < data.length; i++) {
      const contextItem = data[i];

      if (contextItem.place_type.includes('locality')) {
        formattedAddress.landmark = contextItem.text;
      } else if (contextItem.place_type.includes('place')) {
        formattedAddress.city = contextItem.text;
      } else if (contextItem.place_type.includes('region')) {
        formattedAddress.state = contextItem.text;
      } else if (contextItem.place_type.includes('postcode')) {
        formattedAddress.pincode = contextItem.text;
      }
      else if(contextItem.place_type.includes('neighborhood') ||contextItem.place_type.includes('address') ){
        formattedAddress.address=formattedAddress.address + contextItem.text
      }
    }
  
    console.log(formattedAddress);
    this.formatedCurrentAddress=formattedAddress
    this.assignValues(data,formattedAddress)
  }
  
  useCurentLocation:boolean=false;
  addressResponse:any;
  formatedCurrentAddress:any;

  assignValues(address:any,formattedAddress:any){
    this.useCurentLocation=!this.useCurentLocation;
   this.currentAddress=this.fb.group({
   
    hno:'',
    address:address[0].place_name
   
  })
  console.log(this.currentAddress);
  formattedAddress.username=this.bookingService.name;
  this.formatedCurrentAddress=formattedAddress
  console.log(this.formatedCurrentAddress);
  }

  submit(){
    this.saveAddress(this.address.value);
  }
  saveAddress(data:any){
    console.log(this.bookingService.name,this.bookingService.phoneNumber);
    
    this.address.value.mobileNumber=this.bookingService.phoneNumber;
    

    const requestBody={
      userId:localStorage.getItem('userId'),
      username:data.username,
      bookingType:'self',
      mobileNumber:this.bookingService.phoneNumber,
      address:data.address,
      city:data.city,
      landmark:data.landmark,
      state:data.state,
      pincode:data.pincode,
      latitude:this.coordinates[1],
      longitude:this.coordinates[0]
    }
    console.log(requestBody);
    const api='https://api.coolieno1.in/v1.0/users/user-address';
    this.http.post(api,requestBody).subscribe({
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
    console.log(this.formatedCurrentAddress);
    this.assignValues(this.addressResponse,this.formatedCurrentAddress)
    this.saveAddress(this.formatedCurrentAddress)
  }
  navToMap(){
    this.router.navigate(['maps'])
  }
}
