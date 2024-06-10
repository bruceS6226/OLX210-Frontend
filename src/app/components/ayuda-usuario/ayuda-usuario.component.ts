import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Usuario } from 'src/app/interfaces/usuario';
import { UsuarioService } from 'src/app/services/usuario.service';
import * as jwt from 'jwt-decode'
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

interface InformacionToken {
  id_usuario: number;
}

@Component({
  selector: 'app-ayuda-usuario',
  templateUrl: './ayuda-usuario.component.html',
  styleUrls: ['./ayuda-usuario.component.css']
})
export class AyudaUsuarioComponent implements OnInit {
  public usuario: Usuario;
  private token: string | null;
  public tokenParams: string = '';

  constructor(
    private _usuarioService: UsuarioService,
    private router: Router,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {
    this.usuario = new Usuario(0, '', '', '', '', '', '', '', '', '', '', '', false, false, 0, 0, 0, 1, 0, 0);
    this.route.params.subscribe(params => this.tokenParams = params['token']);
    this.token = localStorage.getItem('token');
  }
  ngOnInit(): void {
    this.obtenerUsuario();
  }
  obtenerUsuario() {
    if (this.token) {
      const info = jwt.jwtDecode(this.token) as InformacionToken;
      this._usuarioService.getUsuario(info.id_usuario).subscribe({
        next: (response) => {
          this.usuario = response;
          if (response.correo_verificado) {
            this.router.navigate(['/'])
            return;
          }
          if (this.tokenParams) {
            this._usuarioService.validarCorreo(this.tokenParams).subscribe()
            setTimeout(() => {
              return this.router.navigate(['/dashboard']);
            }, 8000);
          }
        },
      })
    }
  }
  reenviarCorreo() {
    if (this.token) {
      this._usuarioService.reenviarCorreo(this.token).subscribe();
      this.dialog.open(ContenidoDialogoReenviar, {
        width: "40%",
        data: this.usuario.correo
      })
    }
  }
}

@Component({
  selector: 'dialog-content',
  template: `
    <h1 mat-dialog-title>¡Enlace reenviado al correo electrónico!</h1>
    <mat-dialog-content class="mat-typography">
      Hemos reenviado el enlace de confirmación a la dirección de correo electrónico proporcionada: <b>{{data}}</b>.
      Si no encuentras nuestro correo electrónico en tu bandeja de entrada, por favor revisa tu carpeta de spam o correo no deseado.
      <br>¡Gracias por tu paciencia y por formar parte de nuestra comunidad!
    </mat-dialog-content>
    <mat-dialog-actions class="" align="end">
      <button color="primary" mat-raised-button [mat-dialog-close]="true" cdkFocusInitial>OK</button>
    </mat-dialog-actions>
  `,
  standalone: true,
  imports: [MatDialogModule, MatButtonModule]
})
export class ContenidoDialogoReenviar {
  constructor(
    public dialogRef: MatDialogRef<ContenidoDialogoReenviar>,
    @Inject(MAT_DIALOG_DATA) public data: string
  ) { }
}