import { Component } from '@angular/core';
import { FcmService } from './fcm.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'CoolieNo.1_User';
  constructor(private fcmService:FcmService){
    this.fcmService.requestPermission();
    this.fcmService.receiveMessage();
  }
}
