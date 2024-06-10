import { Component, Inject, Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  constructor(private dialog: MatDialog) { }

  msjError(e: HttpErrorResponse | string) {
    if (typeof e === 'string') {
      this.mostrarDialogoError(e);
    } else {
      if (e.error && e.error.msg) {
        this.mostrarDialogoError(e.error.msg);
      } else {
        console.log(e);
        this.mostrarDialogoError('Ha ocurrido un error, comuníquese con el administrador');
      }
    }
  }
  private mostrarDialogoError(mensaje: string) {
    const dialogRef = this.dialog.open(ContenidoDialogoError, { width: '40%', data: mensaje });
  }
}

@Component({
  selector: 'dialog-content',
  template: `
    <h1 mat-dialog-title>¡Ha ocurrido un error!</h1>
    <mat-dialog-content class="mat-typography">
      {{data}}
    </mat-dialog-content>
    <mat-dialog-actions class="" align="end">
      <button color="warn" mat-raised-button mat-dialog-close>Cerrar</button>
    </mat-dialog-actions>
  `,
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
})
export class ContenidoDialogoError {
  constructor(
    public dialogRef: MatDialogRef<ContenidoDialogoError>,
    @Inject(MAT_DIALOG_DATA) public data: string,
  ) { }
}