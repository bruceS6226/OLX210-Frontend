import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Usuario } from 'src/app/interfaces/usuario';
import { ErrorService } from 'src/app/services/error.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [UsuarioService, ErrorService]
})
export class LoginComponent {

  public usuario: Usuario;
  public contrasenia: string;
  public loadingCrear: boolean = false;
  public loadingUbicacion: boolean = false;
  public loadingCancelar: boolean = false;
  private myAppIdUser: string;

  constructor(
    private _usuarioService: UsuarioService,
    private _errorService: ErrorService,
    private toastr: ToastrService,
    private router: Router,
  ) {
    this.usuario = new Usuario(0, '', '', '', '', '', '', '', '', '', '', 0, 0, 0);
    this.contrasenia = "";
    this.myAppIdUser = environment.id_user;
  }

  ingresarUsuario(form: NgForm) {
    this.loadingCrear = true;
    this.usuario.contrasenia = this.contrasenia;
    this._usuarioService.login(this.usuario).subscribe({
      next: (response) => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('id_usuario', response.id_usuario.toString());
        this.toastr.success(`Es un placer tenerte de nuevo`, 'BIENVENIDO');
          this.router.navigate(['/']);
      },
      error: (e: HttpErrorResponse) => {
        this._errorService.msjError(e);
        this.loadingCrear = false;
      }
    });
  }

  public mostrarContrasenia: boolean = false;
  mostrarContraseniaFuntion() { this.mostrarContrasenia = !this.mostrarContrasenia; }
  cancelar() { this.loadingCancelar = true; this.router.navigate(['/']); }

  public regresarAcceso() {
    this.router.navigate(['/acceso']);
  }

}
