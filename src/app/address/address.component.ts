import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MapboxService } from '../mapbox.service';
import { ToastrsService } from '../toastrs.service';
import { UserDetailsService } from '../user-details.service';
import { Subscription } from 'rxjs';
import { SubscriptionService } from '../subscription.service';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrl: './address.component.css'
})
export class AddressComponent implements OnInit, OnDestroy {

  private responseAddress: any;
  public address: any[] = [];
  private getAddressSubscription!: Subscription;
  private deleteAddressSubscriptions: Subscription[] = [];
  constructor(private readonly location: Location,
    private readonly router: Router,
    private readonly userDetailsService: UserDetailsService,
    private readonly mapBoxService: MapboxService,
    private readonly toasterService: ToastrsService,
    private readonly subscriptionService: SubscriptionService
  ) {
  }

  ngOnInit(): void {
    this.mapBoxService.initializeMap('mapContainer');
    this.getAddress();
  }

  navToBack() {
    this.location.back();
  }

  getAddress() {
    this.getAddressSubscription = this.userDetailsService.getAddress().subscribe(
      (response) => {
        console.log(response);
        this.responseAddress = response;
        if (response) {
          response.map((element: any) => {
            const add = element.address + ', ' + element.landmark + ', ' + element.city + ', ' + element.state + ', ' + element.pincode;
            this.address.push({ add });
          });
        } else {
          console.error('Response array is undefined or null');
        }
        console.log(this.address);
      }
    );
  }
  navToAddAddress() {
    this.router.navigate(['addAddress']);
  }
  deleteAddress(index: any) {
    this.toasterService.showSuccess('address deleted sucessfully', 'Toastr fun!')
    console.log(this.responseAddress[index]._id);
    const id = this.responseAddress[index]._id;
    const deleteSubs = this.userDetailsService.deleteAddress(id).subscribe({
      next: (response) => {
        console.log(response);

        this.address = [];
        this.getAddress();
      },
      error: (err) => {
        console.log(err);
      }
    });
    this.subscriptionService.collectSubscriptions(this.deleteAddressSubscriptions, deleteSubs);
  }
  
  ngOnDestroy(): void {
    this.getAddressSubscription.unsubscribe();
    this.subscriptionService.unsubscribeAll(this.deleteAddressSubscriptions);
  }
}
