import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserDetailsService {

  userName:any;
  fullAddress:any[]=[]
  selectedAddress:any=[];
  userDetailsFromGoogle:any;
  constructor(private http:HttpClient) { }

  getAddress():Observable<any>{
   const userId=localStorage.getItem('userId')
    const api=`https://api.coolieno1.in/v1.0/users/user-address/${userId}`
    return this.http.get<any>(api);
  }

  formatingAddress(address:any){
    this.fullAddress=[];
    address.forEach((element:any) => {
      const name=element.username;
      const respAddress=element.address+element.landmark+element.city+element.state+element.pincode
      const coordinates:any[] =[element.longitude,element.latitude];
      this.fullAddress.push({'id':element._id,'mobilenumber':element.mobileNumber,'name':name,'address':respAddress,'coordinates':coordinates})
    });

    console.log(this.fullAddress);
  }

  edit(data:any){
    const api='https://api.coolieno1.in/v1.0/users/userAuth/login';
   return this.http.post(api,data);
  }
}
