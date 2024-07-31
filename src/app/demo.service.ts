import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DemoService {

  private categoryDataUrl = 'https://api.coolieno1.in/v1.0//core/categories'; // Replace with your API endpoint
  private selectedCategoryId = new BehaviorSubject<number | null>(null);

  constructor(private http: HttpClient) {}

  getCategoryData(): Observable<any[]> {
    return this.http.get<any[]>(this.categoryDataUrl);
  }

  setSelectedCategoryId(id: number): void {
    this.selectedCategoryId.next(id);
  }

  getSelectedCategoryId(): Observable<number | null> {
    return this.selectedCategoryId.asObservable();
  }
}
