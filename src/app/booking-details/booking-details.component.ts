import { Component, OnInit } from '@angular/core';
import { BookingsService } from '../bookings.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-booking-details',
  templateUrl: './booking-details.component.html',
  styleUrl: './booking-details.component.css'
})
export class BookingDetailsComponent implements OnInit {

  public jobDetails: any = [];
  noJobs: any = [
    {
      jobs: [{
        name: 'Facial and skin care',
        count: '1',
        amount: '799'
      },
      {
        name: 'Hand & Foot care',
        count: '1',
        amount: '699'
      },
      ],
      others: '69',
      total: '1574',
      credit: '7',
    }
  ];

  constructor(private readonly bookingService: BookingsService,
    private readonly location: Location,
    private readonly router: Router
  ) {
  }

  ngOnInit(): void {
    this.jobDetails.push(this.bookingService.getSelectedJob());
    console.log(this.jobDetails);
  }


  navToBack() {
    this.location.back();
  }

  navToHelp() {
    this.router.navigate(['help'])
  }

}
