import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  constructor(private toastr: ToastrService) { }

  msjError(e: HttpErrorResponse) {
    if (e.error.msg) {
      this.toastr.error(e.error.msg, 'ERROR');
    } else {
      this.toastr.error('Ha ocurrido un error, comuniquese con el administrador', 'ERROR');
    }
  }
  otroError(e: string) {
    this.toastr.error(e, 'ERROR');
  }
}
