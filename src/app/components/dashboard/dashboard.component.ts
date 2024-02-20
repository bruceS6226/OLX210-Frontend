import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/interfaces/usuario';
import { Categoria } from 'src/app/interfaces/categoria'; // Importa la interfaz de Categoría
import { Subcategoria } from 'src/app/interfaces/subCategoria'; // Importa la interfaz de Subcategoría
import { ToastrService } from 'ngx-toastr';
import { UsuarioService } from 'src/app/services/usuario.service';
import { ErrorService } from 'src/app/services/error.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Administrador } from 'src/app/interfaces/adminstrador';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  public usuarios: Usuario[];
  public administradores: Administrador[];
  public categorias: Categoria[]; // Array de categorías
  public subcategorias: Subcategoria[]; // Array de subcategorías
  public loadingAgregar: boolean = false;

  constructor(
    private _usuarioService: UsuarioService,
    private toastr: ToastrService,
    private _errorService: ErrorService,
    private router: Router) {
    this.usuarios = [];
    this.administradores = [];
    this.categorias = [];
    this.subcategorias = [];
  }

  ngOnInit() {
    this.obtenerUsuarios();
    this.obtenerCategorias();
    this.obtenerSubcategorias();
    this.obtenerAdministradores();
  }
  
  obtenerAdministradores() {
    this._usuarioService.getAdministradores().subscribe({
      next: (response) => {
        this.administradores = response;
        this.administradores.forEach(a => this.obtenerTipoUsuario(a));
        this.administradores.forEach(a => this.obtenerTipoDocumento(a));
        this.administradores.forEach(a => this.obtenerClaseUsuario(a));
      },
      error: (e: HttpErrorResponse) => {
        this._errorService.msjError(e);
      }
    })
  }

  eliminarAdministrador(id: number) {
    this._usuarioService.deleteAdministrador(id).subscribe({
      next: () => {
        this.obtenerAdministradores();
        this.toastr.success('El administrador fue eliminado exitosamente', 'ADMINISTRADOR ELIMINADO');
      },
      error: (e: HttpErrorResponse) => {
        this._errorService.msjError(e);
      }
    });
  }

  agregarAdministrador() {
    this.loadingAgregar = true;
    this.router.navigate(['/create-admin']);
  }

  obtenerUsuarios() {
    this._usuarioService.getUsuarios().subscribe({
      next: (response) => {
        this.usuarios = response;
        this.usuarios.forEach(u => this.obtenerTipoUsuario(u));
        this.usuarios.forEach(u => this.obtenerTipoDocumento(u));
        this.usuarios.forEach(u => this.obtenerClaseUsuario(u));
      },
      error: (e: HttpErrorResponse) => {
        this._errorService.msjError(e);
      }
    })
  }
  
  obtenerCategorias() {
    this._usuarioService.getCategorias().subscribe({
      next: (response) => {
        this.categorias = response;
      },
      error: (e: HttpErrorResponse) => {
        this._errorService.msjError(e);
      }
    })
  }

  obtenerCategoria(subcategoria: Subcategoria) {
    this._usuarioService.getCategoria(subcategoria.id_categoria).subscribe({
      next: (value) => {
        subcategoria.categoria = value;
      },
      error: (e: HttpErrorResponse) => {
        this._errorService.msjError(e);
      }
    });
  }

  eliminarSubcategoria(id: number) {
    this._usuarioService.deleteSubcategoria(id).subscribe({
      next: () => {
        this.obtenerSubcategorias();
        this.toastr.success('La subcategorÍa fue eliminada exitosamente', 'SUBCATEGORÍA ELIMINADA');
      },
      error: (e: HttpErrorResponse) => {
        this._errorService.msjError(e);
      }
    });
  }

  eliminarCategoria(id: number) {
    this._usuarioService.deleteCategoria(id).subscribe({
      next: () => {
        this.obtenerCategorias();
        this.toastr.success('La categorÍa fue eliminada exitosamente', 'CATEGORÍA ELIMINADA');
      },
      error: (e: HttpErrorResponse) => {
        this._errorService.msjError(e);
      }
    });
  }

  obtenerSubcategorias() {
    this._usuarioService.getSubcategorias().subscribe({
      next: (response) => {
        this.subcategorias = response;
        this.subcategorias.forEach(s => this.obtenerCategoria(s));
      },
      error: (e: HttpErrorResponse) => {
        this._errorService.msjError(e);
      }
    })
  }

  obtenerTipoUsuario(usuario: Usuario | Administrador) {
    this._usuarioService.getTipoUsuario(usuario.id_tipo_usuario).subscribe({
      next: (value) => {
        usuario.tipo_usuario = value;
      },
      error: (e: HttpErrorResponse) => {
        this._errorService.msjError(e);
      }
    });
  }

  obtenerTipoDocumento(usuario: Usuario | Administrador) {
    this._usuarioService.getTipoDocumento(usuario.id_tipo_usuario).subscribe({
      next: (value) => {
        usuario.tipo_documento = value;
      },
      error: (e: HttpErrorResponse) => {
        this._errorService.msjError(e);
      }
    });
  }
  obtenerClaseUsuario(usuario: Usuario | Administrador) {
    this._usuarioService.getClaseUsuario(usuario.id_tipo_usuario).subscribe({
      next: (value) => {
        usuario.clase_usuario = value;
      },
      error: (e: HttpErrorResponse) => {
        this._errorService.msjError(e);
      }
    });
  }

  eliminarUsuario(id: number) {
    this._usuarioService.deleteUsuario(id).subscribe({
      next: () => {
        this.obtenerUsuarios();
        this.toastr.success('El usuario fue eliminado exitosamente', 'USUARIO ELIMINADO');
      },
      error: (e: HttpErrorResponse) => {
        this._errorService.msjError(e);
      }
    });
  }

  agregarUsuario() {
    this.loadingAgregar = true;
    this.router.navigate(['/create-user']);
  }
  agregarCategoria() {
    this.loadingAgregar = true;
    this.router.navigate(['/add-category']);
  }
  agregarSubcategoria() {
    this.loadingAgregar = true;
    this.router.navigate(['/add-subcategory']);
  }
}
