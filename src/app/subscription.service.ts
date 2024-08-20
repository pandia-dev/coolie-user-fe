import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {

  constructor() { }

  public unsubscribeAll(subscriptionList: Subscription[]) {
    subscriptionList.forEach((oneSubscription: Subscription) => {
      oneSubscription.unsubscribe();
    })
  }

  public collectSubscriptions(subscriptionList: Subscription[], currentSubscription: Subscription) {
    subscriptionList.push(currentSubscription);
  }
}
