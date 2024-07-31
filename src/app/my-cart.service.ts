import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthenticationService } from './authentication.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MyCartService {

  constructor(private http:HttpClient,
              private authenticationService:AuthenticationService
  ) { }

  addToCart(userId:string,item:any){
    console.log(this.authenticationService.userDetails);
    console.log(item);
    const api='https://api.coolieno1.in/v1.0/users/cart/create-cart';
    const headers=new Headers({

    })
    const items:any=item;
    const requestBody={
      userId:userId,
      items:items
    }
  
    console.log(requestBody);
    return this.http.post<any>(api,requestBody);
  }

  getCartItems(userId: any){
    const api=`https://api.coolieno1.in/v1.0/users/cart/${userId}`;
    return this.http.get<any>(api);
  }

  delete(id:any):Observable<any>{
    const userId=localStorage.getItem('userId')
    const api=`https://api.coolieno1.in/v1.0/users/cart/${userId}/${id}`;
    return this.http.delete<any>(api)
  }
}
