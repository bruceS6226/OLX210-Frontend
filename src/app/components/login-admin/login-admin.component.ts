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
  selector: 'app-login-admin',
  templateUrl: '../login/login.component.html',
  styleUrls: ['./login-admin.component.css']
})
export class LoginAdminComponent {

  public usuario: Usuario;
  public contrasenia: string;
  public loadingCrear: boolean = false;
  public loadingUbicacion: boolean = false;
  public loadingCancelar: boolean = false;
  public existeCorreo: boolean = false;
  public existeContrasenia: boolean = false;

  constructor(
    private _usuarioService: UsuarioService,
    private _errorService: ErrorService,
    private toastr: ToastrService,
    private router: Router,
  ) {
    this.usuario = new Usuario(0, '', '', '', '', '', '', '', '', '', '', '', false, false, 0, 0, 0, 2, 0, 0);
    this.contrasenia = "";
  }

  private temporizador: any = null;
  comprobarCorreo() {
    clearTimeout(this.temporizador);
    this.temporizador = setTimeout(() => {
      this._usuarioService.comprobarExistenciaUsuario('correo', this.usuario).subscribe({
        next: (response) => {
          this.existeCorreo = response;
        },
        error: (e: HttpErrorResponse) => { this._errorService.msjError(e); }
      })
    }, 500);
  }
  comprobarContrasenia() {
    if (this.existeCorreo) {
      this.usuario.contrasenia = this.contrasenia;
      clearTimeout(this.temporizador);
      this.temporizador = setTimeout(() => {
        this._usuarioService.comprobarExistenciaUsuario('contrasenia', this.usuario).subscribe({
          next: (response) => {
            this.existeContrasenia = response;
          },
          error: (e: HttpErrorResponse) => { this._errorService.msjError(e); }
        })
      }, 500);
    }
  }

  verificarFormulario(form: NgForm) {
    for (const controlName in form.controls) {
      if (form.controls.hasOwnProperty(controlName)) {
        const control = form.controls[controlName];
        if (control.invalid || control.errors?.['required']) {
          this.toastr.error('Por favor llenar todos los datos correctamente')
          return false;
        }
      }
    }
    return true;
  }

  ingresarUsuario(form: NgForm) {
    if (this.verificarFormulario(form)) {
      this.loadingCrear = true;
      this.usuario.contrasenia = this.contrasenia;
      this._usuarioService.login(this.usuario).subscribe({
        next: (response) => {
          if (response.id_rol !== 2) {
            localStorage.setItem('user', JSON.stringify(response.usuario));
            localStorage.setItem('token', response.token);
            this.toastr.success(`Es un placer tenerte de nuevo`, 'BIENVENIDO');
            this.router.navigate(['/dashboard/0']);
            this._usuarioService.updateComportamiento(response.usuario.id_comportamiento, 'inicio_sesion').subscribe({});
          } else {
            this.toastr.info(`Por favor ingrese de nuevo. Usted es cliente, ha sido redirigido a su respectivo link`);
            this.loadingCrear = false;
            this.router.navigate(['login']);
          }
        },
        error: (e: HttpErrorResponse) => {
          this._errorService.msjError(e);
          this.loadingCrear = false;
        }
      });
    }
  }

  public mostrarContrasenia: boolean = false;
  mostrarContraseniaFuntion() { this.mostrarContrasenia = !this.mostrarContrasenia; }
  cancelar() { this.loadingCancelar = true; this.router.navigate(['/']); }

  public regresarAcceso() {
    this.router.navigate(['/acceso/admin']);
  }

  public registrar() {
    this.router.navigate(['/signin/admin']);
  }

}

