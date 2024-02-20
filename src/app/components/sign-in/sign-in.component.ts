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
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css'],
  providers: [UsuarioService, ErrorService]
})
export class SignInComponent implements OnInit {
  //usuarios
  public usuario: Usuario;
  public confirmarContrasenia: string;
  public contrasenia: string;
  public token: string | null;

  //spinners
  public loadingCrear: boolean = false;
  public loadingUbicacion: boolean = false;
  //foto perfil
  public archivoSeleccionado: File | undefined;
  public foto: string;
  //tipos de persona
  public tiposUsuario: TiposUsuario[];
  //tipos de persona
  public tiposDocumento: TiposDocumento[];
  //tipos de persona
  public clasesUsuario: ClasesUsuario[];
  //titulo boton
  public tituloBoton: string = "CREAR CUENTA";

  constructor(
    private _usuarioService: UsuarioService,
    private _errorService: ErrorService,
    private toastr: ToastrService,
    private router: Router,
    private http: HttpClient
  ) {
    //this.usuario = new Usuario(0, '', 'Name', 'Lastname', 'ejemplo@olx8.com', '0991125207', 'hombre',
    // '', '2020-01-01', 'Quito,Distrito', '1234567890', 1, 1, 1);
    this.usuario = new Usuario(0, '', '', '', '', '', '', '', '', '', '', 0, 0, 0);
    this.foto = '';
    this.confirmarContrasenia = "";
    this.contrasenia = "";
    this.tiposUsuario = [];
    this.tiposDocumento = [];
    this.clasesUsuario = [];
    this.token = localStorage.getItem('token');
  }
  ngOnInit() {
    this.obtenerTiposUsuario();
    this.obtenerTiposDocumento();
    this.obtenerClasesUsuario();
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
          console.log(localStorage.getItem('id_usuario'));
        }
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
    if (!form) {
      return this._errorService.otroError('Por favor llene todos los campos para poder registrarse');
    }
    this.loadingCrear = true;
    this.usuario.contrasenia = this.contrasenia;
    this._usuarioService.guardarUsuario(this.usuario).subscribe({
      next: (response) => {
        if (this.token == undefined) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('id_usuario', response.id_usuario.toString());
        }
        if (this.archivoSeleccionado) {
          this._usuarioService.updateImage(response.id_usuario, this.archivoSeleccionado as File).subscribe({
            error: (e: HttpErrorResponse) => {
              this._errorService.msjError(e);
            }
          });
        }
        this.router.navigate(['/']);
        this.toastr.success(`${this.usuario.nombre} ${this.usuario.apellido} haz sido registrado con éxito`, 'BIENVENIDO');
      },
      error: (e: HttpErrorResponse) => {
        this._errorService.msjError(e);
        this.loadingCrear = false;
      }
    });
  }

  public latitud: number = -0.22985;
  public longitud: number = -78.52495;
  obtenerUbicacion() {
    this.obtenerCoordenadas();
  }
  obtenerCoordenadas(): Promise<{ latitud: number, longitud: number }> {
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
  private acercamiento: number = 6;
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
    this.calcularUbicacion(latitud, longitud);
    this.marker.on('dragend', (event) => {
      const newLatLng = this.marker.getLatLng();
      this.calcularUbicacion(newLatLng.lat, newLatLng.lng);
    });
  }

  calcularUbicacion(latitud: number, longitud: number) {
    this.http.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitud}&lon=${longitud}&zoom=10&addressdetails=1`)
      .subscribe((response: any) => {
        this.usuario.ubicacion = response.display_name;
      });
  }

  public signinSeccion1: boolean = true;
  public signinSeccion2: boolean = false;
  public signinSeccion3: boolean = false;
  public signinSeccion4: boolean = false;
  mostrarSeccion1() {
    this.signinSeccion2 = false;
    this.signinSeccion1 = true;
  }
  mostrarSeccion2() {
    this.signinSeccion1 = false;
    this.signinSeccion2 = true;
    this.signinSeccion3 = false;
  }
  async mostrarSeccion3() {
    this.signinSeccion2 = false;
    this.signinSeccion3 = true;
    this.signinSeccion4 = false;
  }
  mostrarSeccion4() {
    this.signinSeccion3 = false;
    this.signinSeccion4 = true;
  }

  public regresarAcceso() {
    if (this.token == undefined) {
      this.router.navigate(['/acceso']);
    } else {
      this.router.navigate(['/dashboard']);
    }
  }
}