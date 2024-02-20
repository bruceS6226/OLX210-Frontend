import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Usuario } from 'src/app/interfaces/usuario';
import { ErrorService } from 'src/app/services/error.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import * as L from 'leaflet';
import { TiposUsuario } from 'src/app/interfaces/tiposUsuario';
import { TiposDocumento } from 'src/app/interfaces/tiposDocumento';
import { ClasesUsuario } from 'src/app/interfaces/clasesUsuario';

@Component({
  selector: 'app-editar-perfil',
  templateUrl: './editar-perfil.component.html',
  styleUrls: ['./editar-perfil.component.css']
})
export class EditarPerfilComponent implements OnInit {

  //usuario
  public usuario: Usuario;
  public id_usuario: number;
  //spinners
  public loadingCrear: boolean = false;
  //foto perfil
  public archivoSeleccionado: File | undefined;
  public foto: string;
  private myAppUrl: string;
  private myApiUrl: string;
  //tipos de persona
  public tiposUsuario: TiposUsuario[];
  //tipos de persona
  public tiposDocumento: TiposDocumento[];
  //tipos de persona
  public clasesUsuario: ClasesUsuario[];
  //titulo boton
  public tituloBoton: string = "ACTUALIZAR CUENTA";

  constructor(
    private _usuarioService: UsuarioService,
    private _errorService: ErrorService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.id_usuario = 0;
    this.foto = '';
    this.usuario = new Usuario(this.id_usuario, this.foto, '', '', '', '', '', '', '', '', '', 0, 0, 0);
    this.tiposUsuario = [];
    this.tiposDocumento = [];
    this.clasesUsuario = [];
    this.myAppUrl = environment.url;
    this.myApiUrl = 'api/users/';
    this.route.params.subscribe(params => this.id_usuario = Number(params['id']));
  }

  ngOnInit(): void {
    this.obtenerUsuario();
    this.obtenerTiposUsuario();
    this.obtenerTiposDocumento();
    this.obtenerClasesUsuario();
  }

  //fecha minima = fecha actual restado 3 años
  public fechaMinima: string = new Date(new Date().setFullYear(new Date().getFullYear() - 3)).toISOString().split('T')[0];
  obtenerUsuario() {
    this._usuarioService.getUsuario(this.id_usuario).subscribe({
      next: (user) => {
        this.foto = `${this.myAppUrl}${this.myApiUrl}` + user.foto;
        this.usuario = user;
      },
      error: (e: HttpErrorResponse) => {
        this._errorService.msjError(e);
      },
    })
  }

  obtenerTiposUsuario() {
    this._usuarioService.getTiposUsuario().subscribe({
      next: (value) => {
        this.tiposUsuario = value;
      },
      error: (e: HttpErrorResponse) => {
        this._errorService.msjError(e);
      }
    });
  }
  obtenerTiposDocumento() {
    this._usuarioService.getTiposDocumento().subscribe({
      next: (value) => {
        this.tiposDocumento = value;
      },
      error: (e: HttpErrorResponse) => {
        this._errorService.msjError(e);
      }
    });
  }
  obtenerClasesUsuario() {
    this._usuarioService.getClasesUsuario().subscribe({
      next: (value) => {
        this.clasesUsuario = value;
      },
      error: (e: HttpErrorResponse) => {
        this._errorService.msjError(e);
      }
    });
  }

  alSeleccionarArchivo(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const fileList = inputElement.files;
    if (fileList && fileList.length > 0) {
      this.archivoSeleccionado = fileList[0];
      const fileReader = new FileReader();
      fileReader.onload = (e) => {
        if (e && e.target) {
          this.foto = e.target.result as string;
        }
      };
      fileReader.readAsDataURL(fileList[0]);
    }
  }

  guardarUsuario(form: NgForm) {
    if (!form) {
      return this._errorService.otroError('Por favor llene todos los campos para poder registrarse');
    }
    this._usuarioService.updateUsuario(this.id_usuario, this.usuario).subscribe({
      next: () => {
        this.toastr.success('El usuario fue actualizado exitosamente', 'USUARIO ACTUALIZADO');
        this.obtenerUsuario();
        this.router.navigate(['/'])
        if (this.archivoSeleccionado) {
          this._usuarioService.updateImage(this.id_usuario, this.archivoSeleccionado as File).subscribe({
            error: (e: HttpErrorResponse) => {
              this._errorService.msjError(e);
            }
          });
        }
      },
      error: (e: HttpErrorResponse) => {
        this._errorService.msjError(e);
      }
    });

  }

  public signinSeccion1: boolean = true;
  public signinSeccion2: boolean = false;
  mostrarSeccion1() {
    this.signinSeccion2 = false;
    this.signinSeccion1 = true;
  }
  mostrarSeccion2() {
    this.signinSeccion1 = false;
    this.signinSeccion2 = true;
  }
}