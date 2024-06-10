import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UsuarioService } from '../services/usuario.service';
import * as jwt from 'jwt-decode';

interface InformacionToken {
  id_usuario: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private _usuarioService: UsuarioService) { }
  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Promise<boolean | UrlTree> {
    const token = localStorage.getItem('token');
    var id_rol = 0;
    if (token) {
      const informacionToken = jwt.jwtDecode(token) as InformacionToken;
      const id_usuario = informacionToken.id_usuario;
      try {
        const response = await this._usuarioService.getUsuario(id_usuario).toPromise();
        if (response) {
          id_rol = response.id_rol;
          localStorage.setItem('user', JSON.stringify(response));
          if (!response.correo_verificado) {
            return this.router.createUrlTree(['/verificar-correo']);
          } else {
            if (id_rol == 1) {
              return true;
            } else {
              return this.router.createUrlTree(['/']);
            }
          }
        } else {
          return this.router.createUrlTree(['/']);
        }
      } catch (error) {
        console.error('Error al obtener el usuario:', error);
        return this.router.createUrlTree(['/']);
      }
    } else {
      return this.router.createUrlTree(['/login']);
    }
  }
}
