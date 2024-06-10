import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ExistenciaToken implements CanActivate {
  constructor(private router: Router) { }
  async canActivate( route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
  Promise<boolean | UrlTree> {
    const token = localStorage.getItem('token');
      if (token) {
        return true
      } else {
        return this.router.createUrlTree(['/login']);
      }
    }
  }
  
