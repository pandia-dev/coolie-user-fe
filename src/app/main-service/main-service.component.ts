import { Component, ViewChild } from '@angular/core';
import { ServiceService } from '../service.service';
import { Router } from '@angular/router';
import { FotterComponent } from '../fotter/fotter.component';

@Component({
  selector: 'app-main-service',
  templateUrl: './main-service.component.html',
  styleUrl: './main-service.component.css'
})
export class MainServiceComponent {
  @ViewChild('footer') footer!: FotterComponent;
  services:any=[];
  imageLink=""
  constructor(private readonly servicesService:ServiceService,
              private readonly router:Router
  ){
    this.getService();
    this.getMostBookedservices();
  }
  mostBooked:any;
  covered:any=[
    {
      image:'assets/demo/cutting.png',
      tittle:'Expert haircut starting at Rs.199 ',
      description:'Haircut at home'
    },
    {
      image:'assets/demo/massage.png',
      tittle:'Relax & rejuvenateat home',
      description:'Massage for men'
    },{
      image:'assets/demo/Rectangle 3395.png',
      tittle:'Get experts in 2hours at Rs.149',
      description:'Electricians, Plumbers, Carpenter'
    }
  ]
  getService(){
    this.servicesService.getService().subscribe(
      (response)=>{
        console.log(response);
        this.services=response;
        this.serviceResponse=this.services
      },(error)=>{
        console.log(error)
      }
    )
  }
  getMostBookedservices(){
    this.servicesService.getMostBooked().subscribe(
      (response)=>{
        console.log(response);
        this.mostBooked=response;
      }
    )
  }
  selectedCategory(item:any,index:any){
    console.log(item, index);
    // this.servicesService.readyToGetSubCategory(item,index);
    this.servicesService.readyToGetSubCategory(item, index);
    this.router.navigate(['subServices'])
  }

  searchTerm:string='';
  private serviceResponse:any;
  search(event:any){
    
    let  filteredServices:any;
      console.log("inside");
      filteredServices = this.serviceResponse.filter((service: { name: string; }) =>
        service.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
      this.services=filteredServices;
    
  }
}
