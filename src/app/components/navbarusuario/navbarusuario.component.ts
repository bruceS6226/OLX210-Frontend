import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/interfaces/usuario';
import { ErrorService } from 'src/app/services/error.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-navbarusuario',
  templateUrl: './navbarusuario.component.html',
  styleUrls: ['./navbarusuario.component.css']
})
export class NavbarusuarioComponent {
  
  constructor() {
  }

  ngOnInit(): void {
  }

}
