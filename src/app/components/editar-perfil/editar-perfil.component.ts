import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Usuario } from 'src/app/interfaces/usuario';
import { ErrorService } from 'src/app/services/error.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { ToastrService } from 'ngx-toastr';
import * as L from 'leaflet';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { TiposUsuario } from 'src/app/interfaces/tiposUsuario';
import { TiposDocumento } from 'src/app/interfaces/tiposDocumento';
import { ClasesUsuario } from 'src/app/interfaces/clasesUsuario';
import { EstadoDatos } from 'src/app/interfaces/estadoDatos';
import * as jwt from 'jwt-decode';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

interface InformacionToken {
  id_usuario: number;
}

@Component({
  selector: 'app-editar-perfil',
  templateUrl: './editar-perfil.component.html',
  styleUrls: ['./editar-perfil.component.css']
})
export class EditarPerfilComponent implements OnInit {
  public usuario: Usuario;
  public id_usuario: number = 0;
  public loadingCrear: boolean = false;
  public archivoSeleccionado: File | undefined;
  public foto: string = '';
  private myAppUrl: string;
  private myApiUrl: string;
  public tiposUsuario: TiposUsuario[] = [];
  public tiposDocumento: (TiposDocumento | undefined)[] = [];
  public clasesUsuario: ClasesUsuario[] = [];
  private isMyPerfil: boolean = false;
  public estadoDatos: EstadoDatos;
  private usuarioGuardado;
  private token: string | null;

  constructor(private _usuarioService: UsuarioService, private _errorService: ErrorService, private dialog: MatDialog,
    private toastr: ToastrService, private router: Router, private route: ActivatedRoute, private http: HttpClient) {
    this.usuario = new Usuario(0, '', '', '', '', '', '', '', '', '', '', '', false, false, 0, 0, 0, 1, 0, 0);
    this.estadoDatos = new EstadoDatos(0, true, true, true, true, true, true, true, true, true, true, true);
    this.myAppUrl = environment.url;
    this.myApiUrl = 'api/users/';
    this.route.params.subscribe(params => this.id_usuario = Number(params['id']));
    this.usuarioGuardado = localStorage.getItem('user');
    this.token = localStorage.getItem('token');
  }

  ngOnInit(): void {
    if (this.id_usuario) {
      this.obtenerUsuario(this.id_usuario);
    } else {
      if (this.usuarioGuardado) {
        const token = localStorage.getItem('token');
        if (token) {
          const informacionToken = jwt.jwtDecode(token) as InformacionToken;
          this.id_usuario = informacionToken.id_usuario;
          this.obtenerUsuario(informacionToken.id_usuario);
        }
        this.isMyPerfil = true;
      }
    }
    this.obtenerTiposUsuario();
    this.obtenerTiposDocumento();
    this.obtenerClasesUsuario();
  }
  //fecha minima = fecha actual restado 3 años
  public fechaMinima: string = new Date(new Date().setFullYear(new Date().getFullYear() - 3)).toISOString().split('T')[0];

  obtenerEstadoDatos(id_estado_datos: number) {
    this._usuarioService.getEstadoDatos(id_estado_datos).subscribe({
      next: (response) => { this.estadoDatos = response; },
      error: (e: HttpErrorResponse) => { this._errorService.msjError(e); },
    })
  }

  obtenerUsuario(id: number) {
    this._usuarioService.getUsuario(id).subscribe({
      next: (user) => {
        this.foto = `${this.myAppUrl}${this.myApiUrl}` + user.foto;
        this.usuario = user;
        this.obtenerEstadoDatos(user.id_estado_datos);
      },
      error: (e: HttpErrorResponse) => { this._errorService.msjError(e); },
    })
  }

  obtenerTiposUsuario() {
    this._usuarioService.getTiposUsuario().subscribe({
      next: (value) => { this.tiposUsuario = value; },
      error: (e: HttpErrorResponse) => { this._errorService.msjError(e); }
    });
  }
  public tiposDocumentosEmpresa: (TiposDocumento | undefined)[] = [];
  public tiposDocumentosNatural: (TiposDocumento | undefined)[] = [];
  obtenerTiposDocumento() {
    this._usuarioService.getTiposDocumento().subscribe({
      next: (value) => {
        this.tiposDocumento = value;
        this.tiposDocumentosEmpresa.push(value.find(tipoDocumento => tipoDocumento.nombre_tipo_documento === "Ruc"));
        this.tiposDocumentosNatural.push(value.find(tipoDocumento => tipoDocumento.nombre_tipo_documento === "Cedula"));
        this.tiposDocumentosNatural.push(value.find(tipoDocumento => tipoDocumento.nombre_tipo_documento === "Pasaporte"));
        this.restringirTipoDocumento();
      },
      error: (e: HttpErrorResponse) => { this._errorService.msjError(e); }
    });
  }
  obtenerClasesUsuario() {
    this._usuarioService.getClasesUsuario().subscribe({
      next: (value) => { this.clasesUsuario = value; },
      error: (e: HttpErrorResponse) => { this._errorService.msjError(e); }
    });
  }
  restringirTipoDocumento() {
    const nombreTipoUsuario = this.tiposUsuario.find(tipoUsuario => tipoUsuario.id_tipo_usuario === Number(this.usuario.id_tipo_usuario))?.nombre_tipo_usuario;
    if (nombreTipoUsuario === "Persona natural") {
      this.tiposDocumento = this.tiposDocumentosNatural;
    }
    if (nombreTipoUsuario === "Empresa o persona jurídica") {
      this.tiposDocumento = this.tiposDocumentosEmpresa;
    }
  }

  alSeleccionarArchivo(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const fileList = inputElement.files;
    if (fileList && fileList.length > 0) {
      this.archivoSeleccionado = fileList[0];
      const fileReader = new FileReader();
      fileReader.onload = (e) => {
        if (e && e.target) { this.foto = e.target.result as string; }
      };
      fileReader.readAsDataURL(fileList[0]);
    }
  }

  public latitud: number = -0.22985;
  public longitud: number = -78.52495;
  private acercamiento: number = 15;
  obtenerUbicacion() {
    this.obtenerCoordenadas();
  }
  obtenerCoordenadas(): Promise<{ latitud: number, longitud: number }> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (posicion) => {
          if (this.usuario.ubicacion) {
            const ubicacion = this.usuario.ubicacion.split(',');
            this.latitud = parseFloat(ubicacion[0].trim());
            this.longitud = parseFloat(ubicacion[1].trim());
          } else {
            this.latitud = posicion.coords.latitude;
            this.longitud = posicion.coords.longitude;
          }
          this.acercamiento = 15;
          this.mostrarUbicacionMapa(this.latitud, this.longitud);
        },
        (error) => {
          this.mostrarUbicacionMapa(this.latitud, this.longitud);
        }
      );
    });
  }
  obtenerUbicacionActual(): Promise<{ latitud: number, longitud: number }> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (posicion) => {
          this.latitud = posicion.coords.latitude;
          this.longitud = posicion.coords.longitude;
          this.acercamiento = 15;
          this.mostrarUbicacionMapa(this.latitud, this.longitud);
        },
        (error) => {
          this.mostrarUbicacionMapa(this.latitud, this.longitud);
        }
      );
    });
  }
  private map!: L.Map;
  private marker: L.Marker = L.marker([0, 0]);
  mostrarUbicacionMapa(latitud: number, longitud: number) {
    const mapCenter: L.LatLngTuple = [latitud, longitud];
    if (this.map) {
      this.map.remove();
      this.marker.remove();
    }
    this.map = L.map('map').setView(mapCenter, this.acercamiento);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);
    this.marker = L.marker(mapCenter, { draggable: true }).addTo(this.map);
    this.guardarUbicacion(latitud, longitud);
    this.marker.on('dragend', (event) => {
      const newLatLng = this.marker.getLatLng();
      this.guardarUbicacion(newLatLng.lat, newLatLng.lng);
    });
  }
  guardarUbicacion(latitud: number, longitud: number) {
    this.usuario.ubicacion = `${latitud},${longitud}`;
  }

  guardarUsuario(form: NgForm) {
    if (this.mostrarMensajeErrorCamposVacios(form)) {
      this._usuarioService.updateUsuario(this.id_usuario, this.usuario).subscribe({
        next: (response: any) => {
          if (this.archivoSeleccionado) {
            this._usuarioService.updateImage(this.id_usuario, this.archivoSeleccionado as File).subscribe({
              error: (e: HttpErrorResponse) => {
                this._errorService.msjError(e);
              }
            });
          }
          this.toastr.success('El usuario fue actualizado exitosamente', 'USUARIO ACTUALIZADO');
          if (this.usuario.id_rol == 1) {
            this.router.navigate(['/dashboard/1'])
          } else {
            this.router.navigate(['/dashboard/0'])
          }
          if (this.isMyPerfil) {
            localStorage.setItem('user', JSON.stringify(response.usuario));
          }
          this._usuarioService.updateEstadoDatos(this.usuario.id_estado_datos, this.estadoDatos).subscribe({
            error: (e: HttpErrorResponse) => { this._errorService.msjError(e); }
          });
        },
        error: (e: HttpErrorResponse) => { this._errorService.msjError(e); }
      });
    }
  }
  mostrarMensajeErrorCamposVacios(form: NgForm) {
    for (const controlName in form.controls) {
      if (form.controls.hasOwnProperty(controlName)) {
        const control = form.controls[controlName];
        if (control.invalid || control.errors?.['required'] || control.value === 0) {
          const inputElement = document.getElementById(controlName);
          var placeholder = inputElement?.getAttribute('placeholder');
          if (control.value === 0) {
            const inputElement = document.querySelector(`label[for="${controlName}"]`);
            placeholder = inputElement?.textContent;
          }
          if (controlName === 'genero') {
            placeholder = 'Género';
          }
          this.toastr.error(`El campo "${placeholder}" está vacío o es incorrecto`);
          return false;
        }
      }
    }
    return true;
  }

  restablecerContrasenia() {
    const dialogRef = this.dialog.open(ContenidoDialogoRestablecerContrasenia, {
      width: '40%'
    })
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dialog.open(ContenidoDialogoEnlaceEnviado, {
          width: '40%',
          data: this.usuario.correo
        })
        if (this.token) {
          this._usuarioService.cambiarContrasenia(this.token).subscribe();
        }
      }
    })
  }

  public regresar() {
    if (this.usuario.id_rol == 1) {
      this.router.navigate(['/dashboard/1'])
    } else {
      this.router.navigate(['/dashboard/0'])
    }
  }
}

@Component({
  selector: 'dialog-contente',
  template: `
    <h1 mat-dialog-title>¿Estás seguro de que deseas restablecer tu contraseña?</h1>
    <mat-dialog-content class="mat-typography">
      Antes de proceder, queremos asegurarnos de que seas tú quien está solicitando el cambio de contraseña.
      Se enviará un enlace de restablecimiento a tu dirección de correo electrónico asociada.
    </mat-dialog-content>
    <mat-dialog-actions class="" align="end">
      <button class="mr-2" color="warn" mat-raised-button mat-dialog-close>Cancelar</button>
      <button color="primary" mat-raised-button [mat-dialog-close]="true" cdkFocusInitial>Enviar</button>
    </mat-dialog-actions>
  `,
  standalone: true,
  imports: [MatDialogModule, MatButtonModule]
})
export class ContenidoDialogoRestablecerContrasenia { }

@Component({
  selector: 'dialog-content',
  template: `
    <h1 mat-dialog-title>¡Enlace enviado al correo electrónico!</h1>
    <mat-dialog-content class="mat-typography">
      Hemos enviado un enlace de restablecimiento de contraseña a <b>{{data}}</b>.
      Por favor, verifica tu bandeja de entrada y sigue las instrucciones del correo electrónico para Restablecer tu contraseña.<br>
      Si no encuentras el correo electrónico en tu bandeja de entrada, por favor revisa la carpeta de spam o correo no deseado.
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button color="primary" mat-raised-button mat-dialog-close cdkFocusInitial>OK</button>
    </mat-dialog-actions>
  `,
  standalone: true,
  imports: [MatDialogModule, MatButtonModule]
})
export class ContenidoDialogoEnlaceEnviado {
  constructor(
    public dialogRef: MatDialogRef<ContenidoDialogoEnlaceEnviado>,
    @Inject(MAT_DIALOG_DATA) public data: string
  ) { }
}

