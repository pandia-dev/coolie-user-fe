import { Component, OnDestroy, OnInit } from '@angular/core';
import { MyCartService } from '../my-cart.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-order-summary',
  templateUrl: './order-summary.component.html',
  styleUrl: './order-summary.component.css'
})
export class OrderSummaryComponent implements OnInit, OnDestroy {

  public amount: number = 230;
  public subCategoryVarient: any = [];
  public expandedIndex: number | null = null;
  private initialSubs!: Subscription;

  constructor(private readonly mycartService: MyCartService) {
  }

  ngOnDestroy(): void {
    this.initialSubs.unsubscribe();
  }

  ngOnInit(): void {
    const userId: any = localStorage.getItem('userId');
    this.initialSubs = this.mycartService.getCartItems(userId).subscribe(
      (response) => {
        console.log(response);
        this.subCategoryVarient = response[0].items;
      }, (error) => {
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
}
