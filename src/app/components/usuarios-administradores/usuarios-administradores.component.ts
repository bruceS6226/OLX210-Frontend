import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConfirmarComponent } from 'src/app/dialogs/confirmar/confirmar.component';
import { ClasesUsuario } from 'src/app/interfaces/clasesUsuario';
import { Comportamiento } from 'src/app/interfaces/comportamiento';
import { TiposDocumento } from 'src/app/interfaces/tiposDocumento';
import { TiposUsuario } from 'src/app/interfaces/tiposUsuario';
import { Usuario } from 'src/app/interfaces/usuario';
import { ErrorService } from 'src/app/services/error.service';
import { ExitoService } from 'src/app/services/exito.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-usuarios-administradores',
  templateUrl: '../usuarios-clientes/usuarios-clientes.component.html',
  styleUrls: ['./usuarios-administradores.component.css']
})
export class UsuariosAdministradoresComponent implements OnInit {
  public usuarios: Usuario[];
  public loadingAgregar: boolean = false;
  public tiposUsuario: TiposUsuario[];
  public tiposDocumento: TiposDocumento[];
  public clasesUsuario: ClasesUsuario[];
  public comportamientos: Comportamiento[];
  public bloqueado: Boolean;
  private token: string | null;

  constructor(
    private _usuarioService: UsuarioService,
    private toastr: ToastrService,
    private _errorService: ErrorService,
    private router: Router,
    private dialog: MatDialog,
    private _exitoService: ExitoService) {
    this.usuarios = [];
    this.tiposUsuario = [];
    this.tiposDocumento = [];
    this.clasesUsuario = [];
    this.comportamientos = [];
    this.bloqueado = false;
    this.token = localStorage.getItem('token');
  }

  ngOnInit() {
    this.obtenerTiposUsuario();
    this.obtenerTiposDocumento();
    this.obtenerClasesUsuario();
    this.obtenerUsuarios();
    this.obtenerComportamientos();
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

  obtenerUsuarios() {
    this._usuarioService.getUsuarios().subscribe({
      next: (response) => {
        const usuarios = response.filter(u => u.id_rol === 1);
        this.usuarios = usuarios;
      },
      error: (e: HttpErrorResponse) => {
        this._errorService.msjError(e);
      }
    })
  }

  obtenerComportamientos() {
    this._usuarioService.getComportamientos().subscribe({
      next: (response) => {
        this.comportamientos = response;
      },
      error: (e: HttpErrorResponse) => {
        this._errorService.msjError(e);
      },
    });
  }
  obtenerComportamiento(id_comportamiento: number) {
    return this.comportamientos.find(comportamiento => comportamiento.id_comportamiento === id_comportamiento);
  }

  abrirDialogEliminar(id: number, nombre: string, apellido: string): void {
    const titulo = `¿Está seguro de que desea eliminar el administrador ${nombre} ${apellido}?`;
    const contenido = 'Esta acción eliminará permanentemente el administrador y todos los elementos asociados a ella.';
    const dialogRef = this.dialog.open(ConfirmarComponent, {
      width: '40%',
      data: { titulo, contenido },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) { this.eliminarUsuario(id) }
    });
  }

  eliminarUsuario(id: number) {
    this._usuarioService.deleteUsuario(id).subscribe({
      next: (response) => {
        this.obtenerUsuarios();
        var accion = 'eliminado el administrador';
        var nombreObjeto = response.usuario.nombre;
        if (this.token) {
          this._usuarioService.notificar(this.token, accion, nombreObjeto).subscribe()
        };
        this._exitoService.mostrarExito(response);
      },
      error: (e: HttpErrorResponse) => {
        this._errorService.msjError(e);
      }
    });
  }

  agregarUsuario() {
    this.loadingAgregar = true;
    this.router.navigate(['/create-admin']);
  }

  bloqueoOdesbloqueo(id_usuario: number) {
    this._usuarioService.bloquearOdesbloquearUsuario(id_usuario).subscribe({
      next: (response) => {
        var accion;
        var nombreObjeto = response.usuario.nombre;
        if (response.usuario.bloqueado) {
          accion = 'bloqueado al administrador';
          this._usuarioService.updateComportamiento(response.usuario.id_comportamiento, 'bloqueo').subscribe({
            next: () => { this.obtenerComportamientos(); },
          });
        } else {
          accion = 'desbloqueado al administrador';
        }
        if (this.token) {
          this._usuarioService.notificar(this.token, accion, nombreObjeto).subscribe()
        }
        this._exitoService.mostrarExito(response);
      },
      error: (e: HttpErrorResponse) => {
        this._errorService.msjError(e);
      }
    })
  }
}


