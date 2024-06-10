import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Usuario } from 'src/app/interfaces/usuario';
import { ErrorService } from 'src/app/services/error.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import * as L from 'leaflet';
import { TiposUsuario } from 'src/app/interfaces/tiposUsuario';
import { TiposDocumento } from 'src/app/interfaces/tiposDocumento';
import { ClasesUsuario } from 'src/app/interfaces/clasesUsuario';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css'],
  providers: [UsuarioService, ErrorService]
})
export class SignInComponent implements OnInit {
  public usuario: Usuario;
  public confirmarContrasenia: string = '';
  public confirmarCorreo: string = '';
  public confirmarCelular: string = '09';
  public contrasenia: string = '';
  public token: string | null;
  public loadingCrear: boolean = false;
  public existeNombreCuenta: boolean = false;
  public existeCorreo: boolean = false;
  public existeNumeroDocumento: boolean = false;
  public loadingUbicacion: boolean = false;
  public archivoSeleccionado: File | undefined;
  public foto: string = '';
  public tiposUsuario: TiposUsuario[] = [];
  public tiposDocumento: (TiposDocumento | undefined)[] = [];
  public clasesUsuario: ClasesUsuario[] = [];

  constructor(private _usuarioService: UsuarioService, private _errorService: ErrorService,
    private toastr: ToastrService, private router: Router, private http: HttpClient) {
    this.usuario = new Usuario(0, '', '', '', '', '', '09', '', '', '', '', '', false, false, 0, 0, 0, 2, 0, 0);
    this.token = localStorage.getItem('token');
  }
  ngOnInit() {
    this.obtenerTiposUsuario();
    this.obtenerTiposDocumento();
    this.obtenerClasesUsuario();
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

  private temporizador: any = null;
  comprobarNombreCuenta() {
    clearTimeout(this.temporizador);
    this.temporizador = setTimeout(() => {
      this._usuarioService.comprobarExistenciaUsuario('nombre_cuenta', this.usuario).subscribe({
        next: (response) => {
          this.existeNombreCuenta = response;
          console.log(response)
        },
        error: (e: HttpErrorResponse) => { this._errorService.msjError(e); }
      })
    }, 800);
  }
  comprobarCorreo() {
    clearTimeout(this.temporizador);
    this.temporizador = setTimeout(() => {
      this._usuarioService.comprobarExistenciaUsuario('correo', this.usuario).subscribe({
        next: (response) => {
          this.existeCorreo = response;
        },
        error: (e: HttpErrorResponse) => { this._errorService.msjError(e); }
      })
    }, 800);
  }
  comprobarNumeroDocumento() {
    clearTimeout(this.temporizador);
    this.temporizador = setTimeout(() => {
      this._usuarioService.comprobarExistenciaUsuario('numero_documento', this.usuario).subscribe({
        next: (response) => {
          this.existeNumeroDocumento = response;
        },
        error: (e: HttpErrorResponse) => { this._errorService.msjError(e); }
      })
    }, 800);
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

  public mostrarContrasenia: boolean = false;
  mostrarContraseniaFuntion() { this.mostrarContrasenia = !this.mostrarContrasenia; }
  //fecha minima = fecha actual restado 3 años
  public fechaMinima: string = new Date(new Date().setFullYear(new Date().getFullYear() - 3)).toISOString().split('T')[0];
  public aceptoTerminos: boolean = false;
  cambiarVerificacionTerminos() { this.aceptoTerminos = !this.aceptoTerminos; }

  guardarUsuario(form: NgForm) {
    if (this.mostrarMensajeErrorCamposVacios(form)) {
      if (!this.aceptoTerminos) {
        this.toastr.error("Debe aceptar los términos y condiciones");
        return;
      }
      if (this.confirmarContrasenia !== this.contrasenia) {
        this.toastr.error("Las contraseñas son distintas, porfavor revise bien");
        return;
      }
      this.loadingCrear = true;
      this.usuario.contrasenia = this.contrasenia;
      this._usuarioService.guardarUsuario(this.usuario).subscribe({
        next: (response) => {
          if (this.token == undefined) {
            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify(response.usuario));
          }
          if (this.archivoSeleccionado) {
            this._usuarioService.updateImage(response.id_usuario, this.archivoSeleccionado as File).subscribe({
              error: (e: HttpErrorResponse) => { this._errorService.msjError(e); }
            });
          }
          this.router.navigate(['/dashboard/0']);
          this.toastr.success(`${this.usuario.nombre} ${this.usuario.apellido} haz sido registrado con éxito`, 'BIENVENIDO');
        },
        error: (e: HttpErrorResponse) => {
          this._errorService.msjError(e);
          this.loadingCrear = false;
        }
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

  public latitud: number = -0.22985;
  public longitud: number = -78.52495;
  private acercamiento: number = 7;
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
          this.toastr.info('Porfavor asegúrese de otorgar el permiso de la ubicación actual del navegador')
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
    /*this.http.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitud}&lon=${longitud}&zoom=10&addressdetails=1`)
      .subscribe((response: any) => {
        this.usuario.ubicacion = response.display_name;
      });*/
  }

  public signinSeccion1: boolean = true;
  public signinSeccion2: boolean = false;
  public signinSeccion3: boolean = false;
  public signinSeccion4: boolean = false;
  mostrarSeccion1() {
    this.signinSeccion2 = false;
    this.signinSeccion1 = true;
  }
  mostrarSeccion2(form?: NgForm) {
    if (form) {
      if (this.mostrarMensajeErrorCamposVacios(form)) {
        this.signinSeccion1 = false;
        this.signinSeccion2 = true;
        this.signinSeccion3 = false;
      }
    } else {
      this.signinSeccion1 = false;
      this.signinSeccion2 = true;
      this.signinSeccion3 = false;
    }
  }
  mostrarSeccion3(form?: NgForm) {
    if (form) {
      if (this.mostrarMensajeErrorCamposVacios(form)) {
        this.signinSeccion2 = false;
        this.signinSeccion3 = true;
        this.signinSeccion4 = false;
        this.obtenerUbicacion()
      }
    } else {
      this.signinSeccion2 = false;
      this.signinSeccion3 = true;
      this.signinSeccion4 = false;
      this.obtenerUbicacion()
    }
  }
  mostrarSeccion4(form: NgForm) {
    if (this.mostrarMensajeErrorCamposVacios(form)) {
      this.signinSeccion3 = false;
      this.signinSeccion4 = true;
    }
  }

  public regresarAcceso() {
    if (this.token == undefined) {
      this.router.navigate(['/acceso']);
    } else {
      this.router.navigate(['/dashboard/0']);
    }
  }
}