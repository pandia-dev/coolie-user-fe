import { Component } from '@angular/core';
import { MyCartService } from '../my-cart.service';
import { Location } from '@angular/common';
import { OrdersService } from '../orders.service';

@Component({
  selector: 'app-seperate-sechedule',
  templateUrl: './seperate-sechedule.component.html',
  styleUrl: './seperate-sechedule.component.css'
})
export class SeperateSecheduleComponent {


  subCategoryVarient:any=[];
  constructor(private mycartService:MyCartService,
              private location:Location,
              private orderService:OrdersService
  ){
    
  }
  ngOnInit(): void {
    const userId :any=localStorage.getItem('userId')
    this.mycartService.getCartItems(userId).subscribe(
      (response)=>{
        console.log(response);
        this.subCategoryVarient=response[0].items
      },(error)=>{
        console.log(error);
      }
    )

    this.getNextFourDays()
  }

  showTime:any;
  showSechedule(index:any){
    this.showTime= this.showTime === index ? null : index;
  }

  
  nextFourDays: any[] = [];
  selectedIndex: number = 0;
  getNextFourDays() {
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
    
  }
  formatDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    const month = date.toLocaleDateString('default', { month: 'long' });
    
    return `${day}-${month}-${year}`;
  }

  selectedDate:any;
  selected(item: any, index: any) {
    console.log(item);
    console.log(item.date);
    this.selectedIndex = index;
    const date = new Date(item.date);
  
    // Get the day, month, and year from the Date object
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const year = date.getFullYear();
  
    // Format the date in 'DD-MM-YYYY' format
    const formattedDate = `${day}-${month}-${year}`;
    console.log(formattedDate); // Output: '30-07-2024'
    this.selectedDate=formattedDate
  }

  //time

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


  // amounts
  amount:number=230;
  expandedIndex: number | null = null;
  expand(index: number): void {
    if (this.expandedIndex === index) {
      this.expandedIndex = null; // Collapse if the same index is clicked
    } else {
      this.expandedIndex = index; // Expand the new index
    }
  }

  decrementCount(item:any){
    if (item.quantity>1) {
      item.quantity--;
    }
  }
  incrementCount(item:any){
    item.quantity++;
    console.log(item);
  }

  timeSelected:any;
  selectedTime(time:any){
    console.log(this.selectedDate);
    if (!this.selectedDate) {
      alert("Please select the date");
    } else {
      console.log(time);
      this.timeSelected=time;
    }
    
  }

  readyToOrder:any[]=[];
  setSchedule(item:any){
    try {
      if (!this.selectedDate) {
        throw new Error("Please select the date")
      }
      console.log(item);
    const schedule=`${this.selectedDate} ${this.timeSelected}`;
    
    item.scheduledDate=schedule;
    item.selectedTime=this.timeSelected;
   item.selectedDate=this.selectedDate.split('-')[0];
   item.selectedMonth=this.selectedDate.split('-')[1];
    console.log(item);
    this.readyToOrder.push(item);
    } catch (error) {
     alert("Please select the Date");
    }
    
    // item.push('scheduledDate':schedule)
  }
  

  placeOrder(){
    try {
      
      if (this.readyToOrder.length<=0) {
        throw new Error("Something went wrong.")
      }
      console.log(this.readyToOrder);
      this.orderService.setOrder(this.readyToOrder);
    } catch (error) {
      alert("Something went Wrong. Please try again with date and time ")
    }
    
  }
  // navigation

  navToBack(){
    this.location.back();
  }
}
