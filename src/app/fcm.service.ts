import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireMessaging } from '@angular/fire/compat/messaging';
import { Capacitor } from '@capacitor/core';
import { PushNotification, PushNotificationActionPerformed, PushNotifications, Token } from '@capacitor/push-notifications';
import { ToastrsService } from './toastrs.service';

@Injectable({
  providedIn: 'root'
})
export class FcmService {

  token: string | null = null;

  constructor(private afMessaging: AngularFireMessaging,
    private readonly http:HttpClient,
    private readonly toasterService:ToastrsService) {}

  requestPermission() {
    if (Capacitor.isNativePlatform()) {
      PushNotifications.requestPermissions().then(result => {
        if (result.receive === 'granted') {
          PushNotifications.register();

          PushNotifications.addListener('registration', (token: Token) => {
            console.log('Push registration success, token: ' + token.value);
            this.token = token.value;
            this.saveToken(token.value);
          });

          PushNotifications.addListener('pushNotificationReceived', (notification: PushNotification) => {
            console.log('Push received: ', notification);
          });

          PushNotifications.addListener('pushNotificationActionPerformed', (notification: PushNotificationActionPerformed) => {
            console.log('Push action performed: ', notification);
          });
        }
      });
    } else {
      this.afMessaging.requestToken.subscribe({
        next: (token:any) => {
          console.log('FCM token:', token);
          this.token = token;
          this.saveToken(token);
        },
        error: error => {
          console.error('Error getting token', error);
        }
      });
    }
  }

  receiveMessage() {
    this.afMessaging.messages.subscribe(payload => {
      console.log('Message received: ', payload);
      alert(payload.notification?.title)
    });
  }

  private saveToken(token: string) {
    const api='https://api.coolieno1.in/v1.0/users/user-token';
    const headers= new HttpHeaders({
      'Content-Type': 'application/json'
    })
    const requestBody={
      userId:localStorage.getItem('userId'),
      token:token
    }
    this.http.post(api,requestBody,{headers}).subscribe({
      next:(res)=>{
        console.log(res);
        // this.toasterService.showSuccess("token send sucessfully","Token")
      },error:(err)=>{
        console.log(err);
      }
    })
    
  }

}
