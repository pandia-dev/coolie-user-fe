import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {


  api='https://api.coolieno1.in/v1.0'
  constructor(private http:HttpClient) { }

  getService():Observable<any>{
  
    return this.http.get<any>(this.api+'/core/categories');
  }

  getMostBooked():Observable<any>{
    return this.http.get<any>(this.api+'/admin/most-booked')
  }
  selectedServiceId:any;
  selectedIndex:any;
  readyToGetSubCategory(id:any,index:any){
   this.selectedServiceId=id
   console.log(index);
   this.selectedIndex=index
   console.log(this.selectedIndex);
  }

  getSubCategoty(id:any):Observable<any>{
    const api=`https://api.coolieno1.in/v1.0/core/sub-categories/category/${id}`
     return this.http.get<any>(api);
  }

  getSubCatVarient(catId:any,subCatId:any){
    const api=`https://api.coolieno1.in/v1.0/core/services/filter/${catId}/${subCatId}`;
    return this.http.get<any>(api)
  }
}
