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
  noOfItems:number=0;
  constructor(private readonly servicesService:ServiceService,
              private readonly location:Location,
              private readonly router:Router,
              private readonly orderService:OrdersService,
              private readonly myCartService:MyCartService,
              private readonly authenticService:AuthenticationService
  )
  {
    console.log(this.servicesService.selectedIndex);
    this.selectedCat=this.servicesService.selectedIndex;
    console.log(this.selectedCat);
   this.getService();
   this.getSubCategories(this.servicesService.selectedServiceId)
   
  }

  ngOnInit(): void {
   this.getCount()
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
        this.filteredVarients=[];
      }
    )
  }


    // filtering according to service varient
    selectedIndex: number = 0; 
    filteredVarients:any=[]
    selectVariant(index: number): void {
      this.selectedIndex = index;
     const  selectedVariantName=this.subCategoryVarient[0].categoryId.uiVariant[this.selectedIndex];

     const temp=this.subCategoryVarient;
     this.filteredVarients=this.subCategoryVarient;
     const filter=temp.filter((item: any)=>{
      return item.serviceVariants.some((variant: any) => variant.variantName === selectedVariantName);
     })
     console.log(filter);
     this.filteredVarients=filter;
    }


    // adding the quantity 
  addingCount(item:any){
    item = item.map((element: any) => {
      return { ...element, count: 1 };
    });
    
    console.log(item);
    this.subCategoryVarient=item;
    this.selectVariant(0);
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


  // adding item to cart
  addItem(item: any): void {

    if(!localStorage.getItem('userId')){
      alert("Please log in for add item");
      this.router.navigate(['auth']);
    }
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
        // this.router.navigate(['myCart'])
       this.getCount()
      },
      (err)=>{
        console.log(err);
      }
    
    )
    // console.log(`Index: ${index}, Count: ${this.counts}`);
  }

// getting the count inside the cart
  getCount(){
    this.myCartService.getingLength().subscribe(length => {
        console.log(`Number of items in cart: ${length}`);
        this.noOfItems=length;
      });
    }
  navToCart(){
    this.router.navigate(['myCart'])
  }
}
