import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ToastrsService {

  constructor(private toastr: ToastrService){ 
    this.toastr.success('Hello world!', 'Toastr fun!');
    this.toastr.info('Just some information for you.');
    this.toastr.success('Hello world!', 'Toastr fun!', {
      timeOut: 2000,
      positionClass: 'toast-top-center',
    });
  }

  showSuccess(message: string, title?: string) {
    console.log("inside toggle");
    this.toastr.success('Hello world!', 'Toastr fun!');
    this.toastr.success(message, title);
  }

  showError(message: string, title?: string) {
    this.toastr.error(message, title);
  }

  showInfo(message: string, title?: string) {
    this.toastr.info(message, title);
  }

  showWarning(message: string, title?: string) {
    this.toastr.warning(message, title);
  }

}
