import { Component } from '@angular/core';
import { ServiceService } from '../service.service';
import { UserDetailsService } from '../user-details.service';
import { Router } from '@angular/router';
import { OrdersService } from '../orders.service';

@Component({
  selector: 'app-select-address',
  templateUrl: './select-address.component.html',
  styleUrl: './select-address.component.css',
})
export class SelectAddressComponent {
  constructor(
    private readonly router: Router,
    private readonly servicesService: ServiceService,
    private readonly userDetailsService: UserDetailsService,
    private readonly orderService:OrdersService
  ) {
    this.getAddress()
   
  }
  // getting address

  getAddress() {
    this.userDetailsService.getAddress().subscribe({
      next: (response) => {
        console.log(response);
        this.userDetailsService.formatingAddress(response);

        this.name = this.userDetailsService.fullAddress[0].name;
        this.addressDefault = this.userDetailsService.fullAddress[0].address;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  // assiging address which is selected

  name:any='';
  addressDefault: any;
  address: any[] = [];
  showAddres: boolean = false;
  addresses() {
    this.showAddres = !this.showAddres;
    this.address = this.userDetailsService.fullAddress;
    console.log(this.address);
  }

  // assign the address

  selectAddress(index: number) {
    this.name = this.address[index].name;
    this.addressDefault = this.address[index].address;
    this.showAddres = false;
    console.log(this.userDetailsService.fullAddress[index]);
    this.orderService.setAddressId(this.address[index].id)
    this.userDetailsService.selectedAddress=this.userDetailsService.fullAddress[index];
  }
  navToAddAddress(){
    this.router.navigate(['address']);
  }
}
