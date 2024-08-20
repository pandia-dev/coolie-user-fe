// import { Component } from '@angular/core';
// import { FormBuilder, FormGroup } from '@angular/forms';
// import { AuthenticationService } from '../../authentication.service';

// @Component({
//   selector: 'app-log-in',
//   templateUrl: './log-in.component.html',
//   styleUrl: './log-in.component.css'
// })
// export class LogInComponent {

//   phoneNumber:any;
//   constructor(private fb:FormBuilder,
//               private authService:AuthenticationService
//   ){

//   }

//   getOtp(){
//     this.authService.handlePhoneLogin(this.phoneNumber)
//   }
//   googleSign(){
//     this.authService.handleGoogleLogin()
//   }
// }


import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AuthenticationService } from '../../authentication.service';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { Router } from '@angular/router';
import { SubscriptionService } from '../../subscription.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.css']
})
export class LogInComponent implements OnInit, OnDestroy {

  public phoneNumber: any;
  private recaptchaVerifier: any;
  private optSubscriptions: Subscription[] = [];

  constructor(private readonly fb: FormBuilder,
    private readonly authService: AuthenticationService,
    private readonly router: Router,
    private readonly subscriptionService: SubscriptionService) { }

  ngOnInit() {
    this.setupRecaptcha();
  }
  setupRecaptcha() {
    console.log("about to in");
    if (!this.recaptchaVerifier) {
      console.log("innnnnnnnnnnnnnn");
      this.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
        size: 'invisible',
        callback: (response: any) => {
          this.authService.handlePhoneLogin(this.phoneNumber);
        }
      });
    }
  }
  public getOtp() {
    const optSubscription = this.authService.getOtp(this.phoneNumber).subscribe(
      (response: any) => {
        console.log(response);
        this.authService.otp = response;
        this.router.navigate(['auth/verifyOTP']);
      }, (error: any) => {
        console.log(error);
      }
    );
    this.subscriptionService.collectSubscriptions(this.optSubscriptions, optSubscription);
  }

  googleSign() {
    this.authService.handleGoogleLogin();
  }
  
  ngOnDestroy(): void {
    this.subscriptionService.unsubscribeAll(this.optSubscriptions);
  }
}
