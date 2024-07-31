import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../authentication.service';

@Component({
  selector: 'app-verify-otp',
  templateUrl: './verify-otp.component.html',
  styleUrl: './verify-otp.component.css'
})
export class VerifyOTPComponent {
  @ViewChild('input1') input1!: ElementRef 
  @ViewChild('input2') input2!: ElementRef
  @ViewChild('input3') input3!: ElementRef 
  @ViewChild('input4') input4!: ElementRef 
  @ViewChild('input5') input5!: ElementRef 
  @ViewChild('input6') input6!: ElementRef 
  otp: FormGroup;

  constructor(private form: FormBuilder,
              private authService:AuthenticationService,
              private router:Router
              ) { 
    this.otp = this.form.group({
      inputOne: '',
      inputTwo: '',
      inputThree: '',
      inputFour: '',
       inputFive: '',
        inputSix: ''
    });
  }

  onInput(event: any, position: number) {
    const inputValue = event.target.value;
    if (inputValue.length === 1) {
      switch (position) {
        case 1:
          this.input2.nativeElement.focus();
          break;
        case 2:
          this.input3.nativeElement.focus();
          break;
        case 3:
          this.input4.nativeElement.focus();
          break;
        case 4:
          this.input5.nativeElement.focus();
          break;
        case 5:
          this.input6.nativeElement.focus();
          break;
        case 6:
          break;
        default:
          break;
      }
    }
  }

  login() {
    const enterOtp=this.otp.value.inputOne+this.otp.value.inputTwo+this.otp.value.inputThree+this.otp.value.inputFour+this.otp.value.inputFive+this.otp.value.inputSix
    const intOtp = parseInt(enterOtp, 10);
    console.log(intOtp);
   this.authService.verifyOtp(intOtp).subscribe(
    (response:any)=>{
      console.log(response.token);
      this.setToken(response)
      this.router.navigate(['home']);
    },(error)=>{
      console.log(error);
    }
   )
  
  }

 setToken(token:string){
  this.authService.setToken(token)
 }
  
 
 


 

 


  



}
