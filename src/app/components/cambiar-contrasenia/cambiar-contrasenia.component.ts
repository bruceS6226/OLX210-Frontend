import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ErrorService } from 'src/app/services/error.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { ExitoService } from 'src/app/services/exito.service';

@Component({
  selector: 'app-cambiar-contrasenia',
  templateUrl: './cambiar-contrasenia.component.html',
  styleUrls: ['./cambiar-contrasenia.component.css']
})
export class CambiarContraseniaComponent implements OnInit {
  public confirmarContrasenia: string = '';
  public contrasenia: string = '';
  public token: string | null;
  public otp: string = '';
  public loadingCrear: boolean = false;

  constructor(private _usuarioService: UsuarioService, private _errorService: ErrorService, private router: Router,
    private dialog: MatDialog, private _exitoService: ExitoService, private route: ActivatedRoute) {
    this.token = localStorage.getItem('token');
    this.route.params.subscribe(params => this.otp = params['otp'])
  }
  ngOnInit() {
  }
  public mostrarContrasenia: boolean = false;
  mostrarContraseniaFuntion() { this.mostrarContrasenia = !this.mostrarContrasenia; }

  verificarFormulario(form: NgForm) {
    for (const controlName in form.controls) {
      if (form.controls.hasOwnProperty(controlName)) {
        const control = form.controls[controlName];
        if (control.invalid || control.errors?.['required']) {
          this._errorService.msjError('Por favor llenar todos los datos correctamente');
          return false;
        }
      }
    }
    return true;
  }
  actualizarContrasenia(form: NgForm) {
    this._usuarioService.validarOTP(this.otp).subscribe({
      next: () => {
        if (this.verificarFormulario(form)) {
          if (this.confirmarContrasenia !== this.contrasenia) {
            this._errorService.msjError("Las contraseñas son distintas, porfavor revise bien");
          } else {
            if (this.token) {
              this._usuarioService.actualizarContrasenia(this.token, this.contrasenia).subscribe({
                next: (response) => {
                  this._exitoService.mostrarExito(response)
                  this.router.navigate(['/'])
                },
                error: (e) => {
                  this._errorService.msjError(e)
                }
              })
            }
          }
        }
      },
      error: (e) => {
        this._errorService.msjError(e);
        this.router.navigate(['/my-perfil'])
      },
    })

  }
  public regresar() {
    this.router.navigate(['/my-perfil']);
  }
  public registrar() {
    this.router.navigate(['/signin']);
  }
}