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


import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AuthenticationService } from '../../authentication.service';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.css']
})
export class LogInComponent implements OnInit {

  phoneNumber: any;
  recaptchaVerifier: any;

  constructor(private fb: FormBuilder, 
    private authService: AuthenticationService,
    private router:Router) { }

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
  getOtp() {
    // this.authService.handlePhoneLogin(this.phoneNumber);
    this.authService.getOtp(this.phoneNumber).subscribe(
      (response: any)=>{
        console.log(response);
        this.router.navigate(['auth/verifyOTP']);
      },(error: any)=>{
        console.log(error);
      }
    )
  }

  googleSign() {
    this.authService.handleGoogleLogin();
  }
}
