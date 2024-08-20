// import { Component, ElementRef, ViewChild } from '@angular/core';
// import { FormBuilder, FormGroup } from '@angular/forms';
// import { AuthenticationService } from '../authentication.service';
// import { Location } from '@angular/common';
// import { UserDetailsService } from '../user-details.service';

// @Component({
//   selector: 'app-edit-profile',
//   templateUrl: './edit-profile.component.html',
//   styleUrl: './edit-profile.component.css'
// })
// export class EditProfileComponent {
//   @ViewChild('fileInput') fileInput!: ElementRef;
//   userDetails!:FormGroup
//   userFromGoogle:any;
//   profileImageUrl: string ='';
//   constructor(private fb:FormBuilder,
//               private authenticationService:AuthenticationService,
//               private location:Location,
//               private userDetailsService:UserDetailsService
//   )
//   {
//     this.userFromGoogle=this.userDetailsService.userDetailsFromGoogle
//     this.userDetails=this.fb.group({
//       name:'',
//       email:'',
//       image:'',

//       phone:''
//     })

//   }

//   async emailVerify(){
//   this.authenticationService.handleGoogleLogin();
//    await console.log(this.authenticationService.handleGoogleLogin());

//   }

//   navToBack(){
//     this.location.back();
//   }
//   triggerFileInput() {
//     console.log("click");
//     const fileInput = document.querySelector('#fileInput') as HTMLElement;
//     fileInput.click();
//   }

//   onFileSelected(event: Event) {
//     console.log("inside select");
//     const input = event.target as HTMLInputElement;
//     if (input.files && input.files[0]) {
//       const file = input.files[0];
//       const reader = new FileReader();

//       reader.onload = (e: any) => {
//         this.profileImageUrl = e.target.result;
//       };

//       reader.readAsDataURL(file);
//     }
//   }
// }



import { Location } from '@angular/common';
import { Component, ViewChild, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { UserDetailsService } from '../user-details.service';
import { BookingsService } from '../bookings.service';
import { Subscription } from 'rxjs';
import { SubscriptionService } from '../subscription.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnDestroy {
  @ViewChild('fileInput') fileInput!: ElementRef;

  public userDetails: FormGroup = this.fb.group({
    name: [''],
    email: [''],
    phone: this.bookingService.phoneNumber
  });
  public profileImageUrl: string = 'assets/icons/profile.png'; // Default image URL
  private selectedFile: File | null = null;
  private editSubscriptions: Subscription[] = [];

  constructor(private fb: FormBuilder,
    private readonly afAuth: AngularFireAuth,
    private readonly location: Location,
    private readonly userDetailsService: UserDetailsService,
    private readonly bookingService: BookingsService,
    private readonly subscriptionService: SubscriptionService
  ) {
  }

  navToBack() {
    this.location.back();
  }

  async emailVerify() {
    const provider = new firebase.auth.GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: 'select_account'
    });
    let details;
    try {
      const result: any = await this.afAuth.signInWithPopup(provider);
      console.log('Google login result:', result);
      console.log(result.user.multiFactor.user.email);
      const email = result.user.multiFactor.user.email;
      this.userDetails.patchValue({ email });

    } catch (error: any) {
      alert("some thing went wrong");
    }

    return details;

  }

  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.selectedFile = input.files[0];
      const reader = new FileReader();

      reader.onload = (e: any) => {
        this.profileImageUrl = e.target.result;
      };
      console.log(this.profileImageUrl);
      reader.readAsDataURL(file);
    }
  }

  save() {
    const formData = new FormData();
    formData.append('name', this.userDetails.get('name')!.value);
    formData.append('email', this.userDetails.get('email')!.value);
    // formData.append('phone', this.userDetails.get('phone')!.value);

    if (this.userDetailsService.userDetailsFromGoogle.user.phone != this.userDetails.get('phone')!.value) {
      alert("you cannot change the mobile number")
    }
    else {
      formData.append('phone', this.userDetails.get('phone')!.value);
    }
    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    const editSubscription = this.userDetailsService.edit(formData).subscribe(
      {
        next: (response) => {
          console.log(response);
        },
        error: (err) => {
          console.log(err);
        }
      }
    );
    this.subscriptionService.collectSubscriptions(this.editSubscriptions, editSubscription);
  }
  
  ngOnDestroy(): void {
    this.subscriptionService.unsubscribeAll(this.editSubscriptions);
  }
}

