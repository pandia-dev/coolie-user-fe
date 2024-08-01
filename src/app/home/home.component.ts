import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ServiceService } from '../service.service';
import { FotterComponent } from '../fotter/fotter.component';
import { UserDetailsService } from '../user-details.service';
import { BookingsService } from '../bookings.service';
import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{
  @ViewChild('footer') footer!: FotterComponent;
  constructor(private router:Router,
              private servicesService:ServiceService,
              private authentication:AuthenticationService,
              private bookingService:BookingsService,
            
              private userDetailsService:UserDetailsService
  ){
    // this.router.navigate(['auth'])
    this.getService()
  }

  ngOnInit(): void {
   
    this.getMostBookedservices();
    this.getUser()
   
  }
  ads=[
    {
      src:'/assets/ads/ads.png'
    },
    {
      src:'/assets/ads/ads.png'
    },{
      src:'/assets/ads/ads.png'
    },{
      src:'/assets/ads/ads.png'
    }
  ]
  service:any;

  mostBooked:any;

  covered:any=[
    {
      image:'assets/demo/cutting.png',
      tittle:'Expert haircut starting at Rs.199 ',
      description:'Haircut at home'
    },
    {
      image:'assets/demo/massage.png',
      tittle:'Relax & rejuvenateat home',
      description:'Massage for men'
    },{
      image:'assets/demo/Rectangle 3395.png',
      tittle:'Get experts in 2hours at Rs.149',
      description:'Electricians, Plumbers, Carpenter'
    }
  ]

  getService(){
    this.servicesService.getService().subscribe(
      (response)=>{
        console.log(response);
        this.service=response;
      },(error)=>{
        console.log(error);
      }
    )
  }
  selectedCategory(id:any, index:any){
    this.servicesService.readyToGetSubCategory(id,index);
    this.router.navigate(['subServices'])
  }

  getMostBookedservices(){
    this.servicesService.getMostBooked().subscribe(
      (response)=>{
        console.log(response);
        this.mostBooked=response;
      }
    )
  }




  getUser(){
    this.authentication.getUser().subscribe(
      (response)=>{
        console.log(response);
        this.userDetailsService.userDetailsFromGoogle=response;
        this.bookingService.name=response.displayName;
        this.bookingService.phoneNumber=response.phone;

      },(error)=>{
        console.log(error);
      }
     )
  }
// navigations starts from here------>
  navToMainService(){
    this.router.navigate(['mainService'])
  }


}
