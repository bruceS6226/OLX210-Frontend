import { Injectable } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { UsuarioService } from '../services/usuario.service';
import { ErrorService } from '../services/error.service';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ValidarOTP implements CanActivate {
  constructor(private router: Router, private route: ActivatedRoute,
    private _usuarioService: UsuarioService, private _errorService: ErrorService) { }
  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Promise<boolean | UrlTree> {
    const token = localStorage.getItem('token');
    const otp = route.paramMap.get('otp');
    try {
      if (otp) {
        const status = await this._usuarioService.validarOTP(otp).toPromise();
        if (status && token) {
          return true;
        } else {
          return this.router.createUrlTree(['/']);
        }
      } else {
        return this.router.createUrlTree(['/']);
      }
    } catch (error) {
      this._errorService.msjError(error as HttpErrorResponse);
      return this.router.createUrlTree(['/']);
    }
  }
}

