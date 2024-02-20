import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Administrador } from 'src/app/interfaces/adminstrador';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-navbar-admin',
  templateUrl: '../navbar/navbar.component.html',
  styleUrls: ['./navbar-admin.component.css']
})

export class NavbarAdminComponent {

  public usuario: Administrador;
  public id: string | null;

  constructor(
    private _usuarioService: UsuarioService,
    private router: Router,
    private toastr: ToastrService
    ) {
      this.usuario = new Administrador(0, '', '', '', '', '', '', '', '', '','', 0, 0, 0);
      this.id = "";
  }

  ngOnInit(): void {
    this.id = localStorage.getItem('id_usuario');
    if (this.id) {
      this.obtenerUsuario();
    }
  }

  obtenerUsuario() {
    this._usuarioService.getAdministrador(Number(this.id)).subscribe({
      next: (admin) => {
        this.usuario = admin;
      }
    })
  }

  cerrarSesion() {
    this.toastr.info('Esperamos tenerte de nuevo aquí, nos vemos pronto', 'SESIÓN CERRADA');
    localStorage.removeItem('token');
    this.id = null;
    localStorage.removeItem('id_usuario');
    this.router.navigate(['/'])
  }

  editarUsuario(){
    this.router.navigate(['/update-perfil/' + this.id])
  }
}