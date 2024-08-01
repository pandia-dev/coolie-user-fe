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
  jobs:any[]=[]

  getBookingHistory(){
    this.bookingService.getBookingHistory().subscribe({
      next:(response)=>{
        console.log(response);
        this.jobs=response;
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
