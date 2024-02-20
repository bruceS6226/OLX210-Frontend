import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Administrador } from 'src/app/interfaces/adminstrador';
import { Usuario } from 'src/app/interfaces/usuario';
import { UsuarioService } from 'src/app/services/usuario.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})

export class NavbarComponent implements OnInit {

  public usuario: Usuario | Administrador;
  public id: string | null;
  public myAppIdUser: string;

  constructor(
    private _usuarioService: UsuarioService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.usuario = new Usuario(0, '', '', '', '', '', '', '', '', '', '', 0, 0, 0);
    this.id = localStorage.getItem('id_usuario');
    this.myAppIdUser = environment.id_user;
  }

  ngOnInit(): void {
    if (this.id) {
      this.obtenerUsuario();
    }
  }
  obtenerUsuario() {
    this._usuarioService.getUsuario(Number(this.id)).subscribe({
      next: (user) => {
        if (user) {
          this.usuario = new Usuario(0, '', '', '', '', '', '', '', '', '', '', 0, 0, 0);
          this.usuario = user;
        }
      },
      error: (e) => {
        this._usuarioService.getAdministrador(Number(this.id)).subscribe({
          next: (admin) => {
            if (admin) {
              this.usuario = new Administrador(0, '', '', '', '', '', '', '', '', '', '', 0, 0, 0);
              this.usuario = admin;
            }
          },
          error(e) {
            console.log("erro");
          },
        })
      },
    })
  }
  cerrarSesion() {
    this.toastr.info('Esperamos tenerte de nuevo aquí, nos vemos pronto', 'SESIÓN CERRADA');
    localStorage.removeItem('token');
    this.id = null;
    localStorage.removeItem('id_usuario');
    this.router.navigate(['/'])
  }

  editarUsuario() {
    if (this.usuario instanceof Usuario) {
      this.router.navigate(['/update-perfil/' + this.id])
    } else {

    }
  }
}

