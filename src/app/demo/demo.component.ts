import { Component, ElementRef, ViewChild } from '@angular/core';
import { DemoService } from '../demo.service';
@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  styleUrl: './demo.component.css'
})
export class DemoComponent {


  categoryData: any[] = [];
  selectedCategoryIdLocal: number | null = null;
  @ViewChild('containerRef') containerRef: ElementRef | undefined;

  tabWidth = 200; // Width of each tab
  visibleTabs = 5; // Number of tabs visible at once
  buttonWidth = 70; // Width of the arrow buttons

  constructor(private categoryService: DemoService) {}

  ngOnInit(): void {
    this.categoryService.getCategoryData().subscribe(
      data => this.categoryData = [...data, ...data, ...data], // Cloning the list for circular scrolling
      (      error: any) => console.error('Error fetching category data', error)
    );
  }

  handleCategoryClick(id: number): void {
    this.categoryService.setSelectedCategoryId(id);
    this.selectedCategoryIdLocal = id;
    this.scrollToSelectedTab(id);
  }

  scrollToSelectedTab(id: number): void {
    if (this.containerRef) {
      const selectedTab = document.getElementById(`tab-${id}`);
      if (selectedTab) {
        const tabLeftPosition = selectedTab.offsetLeft;
        this.containerRef.nativeElement.scrollTo({
          left: tabLeftPosition - this.buttonWidth,
          behavior: 'smooth'
        });
      }
    }
  }

  scrollLeft(): void {
    if (this.containerRef) {
      this.containerRef.nativeElement.scrollBy({
        left: -this.tabWidth * this.visibleTabs,
        behavior: 'smooth'
      });
      setTimeout(() => {
        // if (this.containerRef.nativeElement.scrollLeft === 0) {
        //   this.containerRef.nativeElement.scrollTo({
        //     left: this.containerRef.nativeElement.scrollWidth / 3,
        //     behavior: 'instant'
        //   });
        // }
      }, 500);
    }
  }

  scrollRight(): void {
    if (this.containerRef) {
      this.containerRef.nativeElement.scrollBy({
        left: this.tabWidth * this.visibleTabs,
        behavior: 'smooth'
      });
  //     setTimeout(() => {
  //       if (
  //         this.containerRef.nativeElement.scrollLeft >=
  //         this.containerRef.nativeElement.scrollWidth - this.containerRef.nativeElement.clientWidth
  //       ) {
  //         this.containerRef.nativeElement.scrollTo({
  //           left: this.containerRef.nativeElement.scrollWidth / 3,
  //           behavior: 'instant'
  //         });
  //       }
  //     }, 500);
  //   }
  // }
}
  }
}
