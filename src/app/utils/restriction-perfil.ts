import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RestrictionPerfil implements CanActivate {
  private myAppIdUser: string;
  constructor(private router: Router) {
    this.myAppIdUser = environment.id_user;
  }
  canActivate( route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
  Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const token = localStorage.getItem('token');
    if (token == undefined) {
      this.router.navigate(['/']);
      return false;
    } else {
      return true;
    }
  }
}
