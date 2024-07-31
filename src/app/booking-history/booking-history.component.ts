import { Location } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { BookingsService } from '../bookings.service';
import { FotterComponent } from '../fotter/fotter.component';

@Component({
  selector: 'app-booking-history',
  templateUrl: './booking-history.component.html',
  styleUrl: './booking-history.component.css'
})
export class BookingHistoryComponent {
  @ViewChild('footer') footer!: FotterComponent;
  navToBack(){
    this.location.back()
  }
  constructor(private location:Location,
              private bookingService:BookingsService,
              private router:Router
  ){
    this.getBookingHistory();
  }
  jobs:any[]=[
    {
      date:'12/02/122',
      name:'anil',
      value:'100',
      paymentDone:'100'
    },
    {
      date:'12/02/122',
      name:'anil',
      value:'100',
      paymentDone:'100'
    },
    {
      date:'12/02/122',
      name:'anil',
      value:'100',
      paymentDone:'100'
    }
  ]

  getBookingHistory(){
    this.bookingService.getBookingHistory().subscribe({
      next:(response)=>{
        console.log(response);
      },
      error:(err)=>{
        console.log(err);
      }
    })
  }
  selectedJob(item:any){
    console.log(item);
    this.bookingService.selectedJobDetails(item);
    this.router.navigate(['bookingDetails'])
  }

}
