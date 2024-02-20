import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Categoria } from 'src/app/interfaces/categoria';
import { Subcategoria } from 'src/app/interfaces/subCategoria';
import { ErrorService } from 'src/app/services/error.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-agregar-subcategoria',
  templateUrl: './agregar-subcategoria.component.html',
  styleUrls: ['./agregar-subcategoria.component.css']
})
export class AgregarSubcategoriaComponent implements OnInit {

  public subcategoria: Subcategoria;
  public categorias: Categoria[];
  public id_subcategoria: number;
  public loadingCrear: boolean = false;
  public nombreBoton: String;
  constructor(
    private _usuarioService: UsuarioService,
    private _errorService: ErrorService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.id_subcategoria = 0;
    this.subcategoria = new Subcategoria(this.id_subcategoria, 0, '', '');
    this.categorias = [];
    this.nombreBoton = "";
  }
  ngOnInit() {
    this.obtenerCategorias();
    this.nombreBoton = "AGREGAR SUBCATEGORÍA";
    this.route.params.subscribe(params => {
      this.id_subcategoria = Number(params['id']);
      if (this.id_subcategoria) {
        this.obtenerSubcategoria();
        this.nombreBoton = "EDITAR SUBCATEGORÍA";
      }
    });
  }
  obtenerSubcategoria() {
    this._usuarioService.getSubcategoria(this.id_subcategoria).subscribe({
      next: (subcategoria) => {
        this.subcategoria = subcategoria;
      },
      error: (e: HttpErrorResponse) => {
        this._errorService.msjError(e);
      },
    })
  }
  obtenerCategorias() {
    this.route.params.subscribe(params => {
      this.id_subcategoria = Number(params['id']);
    });
    this._usuarioService.getCategorias().subscribe({
      next: (response) => {
        this.categorias = response;
      },
      error: (e: HttpErrorResponse) => {
        this._errorService.msjError(e);
      }
    })
  }

  ingresarSubcategoria(form: NgForm) {
    this.loadingCrear = true;
    if (this.id_subcategoria) {
      this._usuarioService.updateSubcategoria(this.id_subcategoria, this.subcategoria).subscribe({
        next: (response) => {
          this.toastr.success(`La subcategoría fue actualizada exitosamente`, 'SUBCATEGORÍA ACTUALIZADA');
          this.router.navigate(['/dashboard']);
        },
        error: (e: HttpErrorResponse) => {
          this._errorService.msjError(e);
          this.loadingCrear = false;
        }
      });
    } else {
      this._usuarioService.guardarSubcategoria(this.subcategoria).subscribe({
        next: (response) => {
          this.toastr.success(`La subcategoría fue agregada exitosamente`, 'SUBCATEGORÍA AGREGADA');
          this.router.navigate(['/dashboard']);
        },
        error: (e: HttpErrorResponse) => {
          this._errorService.msjError(e);
          this.loadingCrear = false;
        }
      });
    }
  }
}