import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Usuario } from 'src/app/interfaces/usuario';
import { UsuarioService } from 'src/app/services/usuario.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})

export class NavbarComponent implements OnInit {

  public usuario: Usuario;

  constructor(
    private _usuarioService: UsuarioService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.usuario = new Usuario(0, '', '', '','', '', '', '', '', '', '', '', false, false, 0, 0, 0, 1, 0, 0);
  }

  ngOnInit(): void {
    this.obtenerUsuario();
  }
  
  obtenerUsuario() {
    const userString = localStorage.getItem('user');
    if (userString !== null) {
      this.usuario = JSON.parse(userString) as Usuario;
    }
  }
  cerrarSesion() {
    this.toastr.info('Esperamos tenerte de nuevo aquí, nos vemos pronto', 'SESIÓN CERRADA');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.usuario.id_usuario = 0;
    this.router.navigate(['/']);
  }

  editarUsuario() {
    this.router.navigate(['/my-perfil/'])
  }
}

