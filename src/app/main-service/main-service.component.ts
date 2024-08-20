import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ServiceService } from '../service.service';
import { Router } from '@angular/router';
import { FotterComponent } from '../fotter/fotter.component';
import { combineLatest, Subscription } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-main-service',
  templateUrl: './main-service.component.html',
  styleUrl: './main-service.component.css'
})
export class MainServiceComponent implements OnInit, OnDestroy {

  @ViewChild('footer') footer!: FotterComponent;
  services: any = [];
  imageLink = "";
  searchTerm: string = '';
  private serviceResponse: any;
  mostBooked: any;
  covered: any = [
    {
      image: 'assets/demo/cutting.png',
      tittle: 'Expert haircut starting at Rs.199 ',
      description: 'Haircut at home'
    },
    {
      image: 'assets/demo/massage.png',
      tittle: 'Relax & rejuvenateat home',
      description: 'Massage for men'
    }, {
      image: 'assets/demo/Rectangle 3395.png',
      tittle: 'Get experts in 2hours at Rs.149',
      description: 'Electricians, Plumbers, Carpenter'
    }
  ];
  private initialSubs!: Subscription;

  constructor(private readonly servicesService: ServiceService,
    private readonly router: Router
  ) {
  }

  ngOnInit(): void {
    this.initialSubs = combineLatest(this.servicesService.getService(), this.servicesService.getMostBooked()).subscribe(
      ([serviceList, mostBooked]) => {
        this.services = serviceList;
        this.serviceResponse = serviceList;
        this.mostBooked = mostBooked;
      },
      (error: HttpErrorResponse) => {
        console.error(error.message);
      }
    )
  }

  selectedCategory(item: any, index: any) {
    console.log(item, index);
    // this.servicesService.readyToGetSubCategory(item,index);
    this.servicesService.readyToGetSubCategory(item, index);
    this.router.navigate(['subServices'])
  }

  search() {
    let filteredServices: any;
    console.log("inside");
    filteredServices = this.serviceResponse.filter((service: { name: string; }) =>
      service.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    this.services = filteredServices;

  }

  ngOnDestroy(): void {
    this.initialSubs.unsubscribe();
  }
}
