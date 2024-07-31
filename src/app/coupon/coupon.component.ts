import { Location } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-coupon',
  templateUrl: './coupon.component.html',
  styleUrl: './coupon.component.css'
})
export class CouponComponent {
  constructor(private location:Location){

  }
  navToBack(){
    this.location.back();
  }
}
