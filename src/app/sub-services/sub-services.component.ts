import { Component, OnInit } from '@angular/core';
import { ServiceService } from '../service.service';
import { Location } from '@angular/common';
import { MyCartService } from '../my-cart.service';
import { AuthenticationService } from '../authentication.service';
import { Router } from '@angular/router';
import { OrdersService } from '../orders.service';

@Component({
  selector: 'app-sub-services',
  templateUrl: './sub-services.component.html',
  styleUrl: './sub-services.component.css'
})
export class SubServicesComponent implements OnInit{

  services:any=[];
  subCategory:any=[];
  subCategoryVarient:any=[];
  constructor(private servicesService:ServiceService,
              private location:Location,
              private router:Router,
              private orderService:OrdersService,
              private myCartService:MyCartService,
              private authenticService:AuthenticationService
  )
  {
    console.log(this.servicesService.selectedIndex);
    this.selectedCat=this.servicesService.selectedIndex;
    console.log(this.selectedCat);
   this.getService();
   this.getSubCategories(this.servicesService.selectedServiceId)
    
  }

  ngOnInit(): void {
   
  }
  
  getService(){
    this.servicesService.getService().subscribe(
      (response)=>{
        console.log(response);
        this.services=response;
      },(error)=>{
        console.log(error);
      }
    )
  }

  selectedCat:any;
  selectedCategory(item:any,index:any){
    this.servicesService.selectedServiceId=item;
    this.servicesService.selectedIndex=index;
    this.getSubCategories(item)
    this.selectedCat=index;
  }

  getSubCategories(id:any){
    this.servicesService.getSubCategoty(id).subscribe(
      (response)=>{
        console.log(response);
        this.subCategory=response;
        this.getSubCategoryVarient();
      },(error)=>{
        console.log(error);
        console.log(error.error.message);
        if (error.error.message==='No subcategories found for this category') {
          this.subCategory=[];
          this.subCategoryVarient=[];
        }
      }
    )
  }
  selectedSubCatIndex = 0;
  selectSubCategory(index:any){
    this.selectedSubCatIndex=index
    this.getSubCategoryVarient()
  }
  navToBack(){
    this.location.back();
  }

  getSubCategoryVarient(){
    const selectedId=this.servicesService.selectedServiceId;
    const selectedSubCatId=this.subCategory[this.selectedSubCatIndex]._id;
    this.servicesService.getSubCatVarient(selectedId,selectedSubCatId).subscribe(
      (response)=>{
        console.log(response);
        console.log(response.data);
        this.addingCount(response.data);
        
      },(error)=>{
        console.log(error);
        this.subCategoryVarient=[];
      }
    )
  }

  addingCount(item:any){
    item = item.map((element: any) => {
      return { ...element, count: 1 };
    });
    
    console.log(item);
    this.subCategoryVarient=item
  }
  expandedIndex: number | null = null;

  expand(index: number): void {
    if (this.expandedIndex === index) {
      this.expandedIndex = null; // Collapse if the same index is clicked
    } else {
      this.expandedIndex = index; // Expand the new index
    }
  }

  counts: number = 1
  incrementCount(index: any): void {
    index.count++
  }

  decrementCount(index: any): void {
    if (index.count>1) {
      index.count--
    }
    
  }

  addItem(item: any): void {
    console.log(item);
    const userId=this.authenticService.getFromLocalStorage();
    const requestBody=[{
      categoryId:item.categoryId._id,
      subCategoryId:item.subCategoryId._id,
      serviceId:item._id,
      quantity:item.count,
      image:item.subCategoryId.imageKey,
      // price:item.serviceVariants[0].price*item.count
    }]
  
    this.myCartService.addToCart(userId,requestBody).subscribe(
      (res)=>{
        console.log(res);
        this.router.navigate(['myCart'])
      },
      (err)=>{
        console.log(err);
      }
    
    )
    // console.log(`Index: ${index}, Count: ${this.counts}`);
  }


  navToCart(){
    this.router.navigate(['myCart'])
  }
}
