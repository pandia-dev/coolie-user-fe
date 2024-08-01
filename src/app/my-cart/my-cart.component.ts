import { Component, OnInit } from '@angular/core';
import { MyCartService } from '../my-cart.service';
import { Router } from '@angular/router';
import { OrdersService } from '../orders.service';
import { Location } from '@angular/common';
import { RazorpayService } from '../razorpay.service';

@Component({
  selector: 'app-my-cart',
  templateUrl: './my-cart.component.html',
  styleUrl: './my-cart.component.css'
})
export class MyCartComponent implements OnInit{
  expandedIndex: number | null = null;
  subCategoryVarient:any=[];
  
  navToBack(){
    this.location.back();
  }
  constructor(private mycartService:MyCartService,
              private router:Router,
              private orderService:OrdersService,
              private location:Location,
              private razorpayService:RazorpayService
  ){
    
  }
  ngOnInit(): void {
    this.getNextFourDays()
    this.getCartItems();
    
  }

  
  getCartItems(){
    const userId :any=localStorage.getItem('userId')
    this.mycartService.getCartItems(userId).subscribe(
      (response)=>{
        console.log(response);
        this.subCategoryVarient=response[0].items;
        this.calAmount();
      },(error)=>{
        console.log(error);
      }
    )
  }

  expand(index: number): void {
    if (this.expandedIndex === index) {
      this.expandedIndex = null; // Collapse if the same index is clicked
    } else {
      this.expandedIndex = index; // Expand the new index
    }
  }

  delete(id:any,item:any){
   console.log(item);
    this.mycartService.delete(id).subscribe({
      next:(response)=>{
        console.log("item delete",response);
        this.getCartItems();
       
      },
      error:(err)=>{
        console.log(err);
      }
  })
  }
  decrementCount(item:any){
    if (item.quantity>1) {
      item.quantity--;
    }
   
  }
  incrementCount(item:any){
    item.quantity++;
  }

  // schedule   

  showScheduleSection:boolean=false;
  showSchedule(){
    this.showScheduleSection=!this.showScheduleSection
  }
// date======
  nextFourDays: any[] = [];
  selectedIndex: number = 0;
  selectedSechudle:any;
  async getNextFourDays() {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = new Date();

    for (let i = 0; i < 10; i++) {
      const currentDay = new Date(today);
      currentDay.setDate(today.getDate() + i);
      const formattedDate = this.formatDate(currentDay);
     
      this.nextFourDays.push({
        date: formattedDate,
        day: days[currentDay.getDay()],
        workingStaus: false,
        
      });
    }
    this.selectedDate=this.nextFourDays[0];
  }
  formatDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    
    return `${day}-${month}-${year}`;
  }
  
  date = new Date();
  selectedDate:any;
  monthSelected:any=String(this.date.getMonth() + 1).padStart(2, '0');
  dateSelected:any=String(this.date.getDate()).padStart(2, '0');
  selected(item: any, index: any) {
    console.log(item);
    console.log(this.selectedDate);
    this.selectedIndex = index;
    this.selectedDate=this.nextFourDays[index];
    console.log(this.selectedDate);
    this.selectedSechudle=this.selectedDate.date
    this.dateSelected = item.date.toString().split('-')[0];
    // this.daySelected = item.day;
    this.monthSelected = item.date.toString().split('-')[1];
    // this.yearSelected=item.date.toString().split('-')[2];
    // this.nextDaysOfIndex = this.nextFourDays[this.selectedIndex];
    // console.log(this.nextDaysOfIndex);
    console.log(this.monthSelected);
    console.log(this.dateSelected);
  }

  //time
  time:any;
  timing: any[] = [
    { time: '09AM - 10AM', isSelected: false },
    { time: '10AM - 11AM', isSelected: false },
    { time: '11AM - 12PM', isSelected: false },
    { time: '12PM - 01PM', isSelected: false },
    { time: '01PM - 02PM', isSelected: false },
    { time: '02PM - 03PM', isSelected: false },
    { time: '03PM - 04PM', isSelected: false },
    { time: '04PM - 05PM', isSelected: false },
    { time: '05PM - 06PM', isSelected: false }, 
    { time: '06PM - 07PM', isSelected: false },
    { time: '07PM - 08PM', isSelected: false },
    { time: '08PM - 09PM', isSelected: false },
    { time: '09PM - 10PM', isSelected: false },
   
  ];

  timeSelected(){
    console.log(this.time);
    this.selectedSechudle=this.selectedDate.date+" "+this.time
    this.sendOrder()

  }

  // amounts
  amount:number=0;

  calAmount(){
    this.subCategoryVarient.forEach((item: any)=>{
      this.amount=this.amount+item.serviceId.serviceVariants[0].price;
    })
  }
  navToSeparate(){
    this.router.navigate(['separateSechedule']);
  }


  sendOrder(){
    const item =this.subCategoryVarient
    
    for (let index = 0; index < item.length; index++) {
      const element = item[index];
      element['selectedDate'] = this.dateSelected;
      element['selectedMonth'] = this.monthSelected;
      element['scheduledDate'] = this.selectedSechudle;
      element['selectedTime'] = this.time;
    }
    console.log(item);
    this.subCategoryVarient=item
  }
  pay(){
    const currency = 'INR';
    const orderId = 'order_id_from_backend';
    this.razorpayService.payWithRazorpay(this.amount, orderId, currency).subscribe({
      next:(data) => {
        console.log('Payment successful', data);
        this.orderService.setOrder(this.subCategoryVarient,this.amount)
        // Handle successful payment
      },
      error:(err) => {
        console.log('Payment failed', err);
        alert("Something went wrong. please try again later.")
        // Handle payment failure
      }
  });
    // this.orderService.setOrder(this.subCategoryVarient)
  }







  //user id, addressId,[catId],[subCatid],items=[{"of services",sechdule time}],
}
