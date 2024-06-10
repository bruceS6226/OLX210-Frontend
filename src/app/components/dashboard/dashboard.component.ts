import { Component, OnInit } from '@angular/core';
import { Categoria } from 'src/app/interfaces/categoria';
import { Subcategoria } from 'src/app/interfaces/subCategoria';
import { ToastrService } from 'ngx-toastr';
import { UsuarioService } from 'src/app/services/usuario.service';
import { ErrorService } from 'src/app/services/error.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  public categorias: Categoria[] = [];
  public loadingAgregar: boolean = false;
  public index: number = 0;

  constructor(
    private _usuarioService: UsuarioService,
    private toastr: ToastrService,
    private _errorService: ErrorService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const pestania = Number(params['pestania']);
      if (pestania) {
        this.index = pestania;
      }
    });
  }
  cambioSeleccion(event: any) {
    this.index = event.index;
    this.cambiarIndex(this.index);
  }
  cambiarIndex(index: number){
    this.router.navigate(['/dashboard', index]);
  }
  agregarCategoria(id_categoria_padre: number) {
    this.loadingAgregar = true;
    this.router.navigate(['/add-category/', id_categoria_padre]);
  }
}