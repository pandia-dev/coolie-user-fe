import { Component, OnDestroy, OnInit } from '@angular/core';
import { ServiceService } from '../service.service';
import { Location } from '@angular/common';
import { MyCartService } from '../my-cart.service';
import { AuthenticationService } from '../authentication.service';
import { Router } from '@angular/router';
import { combineLatest, Subscription } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { SubscriptionService } from '../subscription.service';

@Component({
  selector: 'app-sub-services',
  templateUrl: './sub-services.component.html',
  styleUrl: './sub-services.component.css'
})
export class SubServicesComponent implements OnInit, OnDestroy {

  public services: any = [];
  public subCategory: any = [];
  public subCategoryVarient: any = [];
  public noOfItems: number = 0;
  public selectedCat: any;
  public selectedSubCatIndex = 0;
  public selectedIndex: number = 0;
  public filteredVarients: any = []
  public expandedIndex: number | null = null;
  private initialSubs!: Subscription;
  private subCatVarSubs!: Subscription;
  private getCountSubs!: Subscription;
  private cartSubs: Subscription[] = [];
  private subCatSubs: Subscription[] = [];

  constructor(private readonly servicesService: ServiceService,
    private readonly location: Location,
    private readonly router: Router,
    private readonly myCartService: MyCartService,
    private readonly authenticService: AuthenticationService,
    private readonly subscriptionService: SubscriptionService
  ) { }

  ngOnDestroy(): void {
    this.initialSubs.unsubscribe();
    this.subCatVarSubs.unsubscribe();
    this.getCountSubs.unsubscribe();
    this.subscriptionService.unsubscribeAll(this.cartSubs);
    this.subscriptionService.unsubscribeAll(this.subCatSubs);
  }

  ngOnInit(): void {
    this.selectedCat = this.servicesService.selectedIndex;
    this.initialSubs = combineLatest(
      this.myCartService.getingLength(),
      this.servicesService.getService(),
      this.servicesService.getSubCategoty(this.servicesService.selectedServiceId)
    ).subscribe(
      ([length, services, subCategory]) => {
        console.log(`Number of items in cart: ${length}`);
        this.noOfItems = length;
        this.services = services;
        this.subCategory = subCategory;
        this.getSubCategoryVarient();
      },
      (error: HttpErrorResponse) => {
        console.error(error.message);
      }
    )
  }

  selectedCategory(item:any,index:any){
    this.servicesService.selectedServiceId=item;
    this.servicesService.selectedIndex=index;
    this.getSubCategories(item)
    this.selectedCat=index;
  }

  getSubCategories(id:any){
    const subCatSubs = this.servicesService.getSubCategoty(id).subscribe(
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
    );
    this.subscriptionService.collectSubscriptions(this.subCatSubs, subCatSubs);
  }

  selectSubCategory(index: any) {
    this.selectedSubCatIndex = index
    this.getSubCategoryVarient()
  }

  navToBack() {
    this.location.back();
  }

  getSubCategoryVarient() {
    const selectedId = this.servicesService.selectedServiceId;
    const selectedSubCatId = this.subCategory[this.selectedSubCatIndex]._id;
    this.subCatVarSubs = this.servicesService.getSubCatVarient(selectedId, selectedSubCatId).subscribe(
      (response) => {
        console.log(response);
        console.log(response.data);
        this.addingCount(response.data);

      }, (error) => {
        console.log(error);
        this.subCategoryVarient = [];
        this.filteredVarients = [];
      }
    )
  }

  // filtering according to service varient
  selectVariant(index: number): void {
    this.selectedIndex = index;
    const selectedVariantName = this.subCategoryVarient[0].categoryId.uiVariant[this.selectedIndex];

    const temp = this.subCategoryVarient;
    this.filteredVarients = this.subCategoryVarient;
    const filter = temp.filter((item: any) => {
      return item.serviceVariants.some((variant: any) => variant.variantName === selectedVariantName);
    })
    console.log(filter);
    this.filteredVarients = filter;
  }

  // adding the quantity 
  addingCount(item: any) {
    item = item.map((element: any) => {
      return { ...element, count: 1 };
    });

    console.log(item);
    this.subCategoryVarient = item;
    this.selectVariant(0);
  }

  expand(index: number): void {
    if (this.expandedIndex === index) {
      this.expandedIndex = null; // Collapse if the same index is clicked
    } else {
      this.expandedIndex = index; // Expand the new index
    }
  }

  incrementCount(index: any): void {
    index.count++
  }

  decrementCount(index: any): void {
    if (index.count > 1) {
      index.count--
    }

  }

  // adding item to cart
  addItem(item: any): void {

    if (!localStorage.getItem('userId')) {
      alert("Please log in for add item");
      this.router.navigate(['auth']);
    }
    console.log(item);
    const userId = this.authenticService.getFromLocalStorage();
    const requestBody = [{
      categoryId: item.categoryId._id,
      subCategoryId: item.subCategoryId._id,
      serviceId: item._id,
      quantity: item.count,
      image: item.subCategoryId.imageKey,
      // price:item.serviceVariants[0].price*item.count
    }]

    const cartSubs = this.myCartService.addToCart(userId, requestBody).subscribe(
      (res) => {
        console.log(res);
        // this.router.navigate(['myCart'])
        this.getCount()
      },
      (err) => {
        console.log(err);
      }
    );
    this.subscriptionService.collectSubscriptions(this.cartSubs, cartSubs);
  }

  // getting the count inside the cart
  getCount() {
    this.getCountSubs = this.myCartService.getingLength().subscribe(length => {
      console.log(`Number of items in cart: ${length}`);
      this.noOfItems = length;
    });
  }

  navToCart() {
    this.router.navigate(['myCart'])
  }
}
