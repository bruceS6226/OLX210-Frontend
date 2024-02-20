import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Categoria } from 'src/app/interfaces/categoria';
import { ErrorService } from 'src/app/services/error.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-agregar-categoria',
  templateUrl: './agregar-categoria.component.html',
  styleUrls: ['./agregar-categoria.component.css']
})
export class AgregarCategoriaComponent implements OnInit {

  public categoria: Categoria;
  public loadingCrear: boolean = false;
  public id_categoria: number;
  public nombreBoton: String;
  constructor(
    private _usuarioService: UsuarioService,
    private _errorService: ErrorService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.id_categoria = 0;
    this.categoria = new Categoria(this.id_categoria, '', '');
    this.nombreBoton = "";
  }
  ngOnInit() {
    this.nombreBoton = "AGREGAR CATEGORÍA";
    this.route.params.subscribe(params => {
      this.id_categoria = Number(params['id']);
      if (this.id_categoria) {
        this.obtenerCategoria();
        this.nombreBoton = "EDITAR CATEGORÍA";
      }
    });
  }
  obtenerCategoria() {
    this._usuarioService.getCategoria(this.id_categoria).subscribe({
      next: (categoria) => {
        this.categoria = categoria;
      },
      error: (e: HttpErrorResponse) => {
        this._errorService.msjError(e);
      },
    });
  }
  ingresarCategoria(form: NgForm) {
    this.loadingCrear = true;
    if (this.id_categoria) {
      this._usuarioService.updateCategoria(this.id_categoria, this.categoria).subscribe({
        next: (response) => {
          this.toastr.success(`La categoría fue actualizada exitosamente`, 'CATEGORÍA ACTUALIZADA');
          this.router.navigate(['/dashboard']);
        },
        error: (e: HttpErrorResponse) => {
          this._errorService.msjError(e);
          this.loadingCrear = false;
        }
      });
    } else {
      this._usuarioService.guardarCategoria(this.categoria).subscribe({
        next: (response) => {
          this.toastr.success(`La categoría fue agregada exitosamente`, 'CATEGORÍA AGREGADA');
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

