import { FlatTreeControl } from '@angular/cdk/tree';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Categoria } from 'src/app/interfaces/categoria';
import { ErrorService } from 'src/app/services/error.service';
import { UsuarioService } from 'src/app/services/usuario.service';

interface CategoriaFlatNode {
  expandable: boolean;
  nombre_categoria: string;
  level: number;
  categoria?: CategoriaFlatNode[];
}

@Component({
  selector: 'app-categoria-arbol',
  templateUrl: './categoria-arbol.component.html',
  styleUrls: ['./categoria-arbol.component.css']
})
export class CategoriaArbolComponent implements OnInit {
  treeControl: FlatTreeControl<CategoriaFlatNode>;
  treeFlattener: MatTreeFlattener<Categoria, CategoriaFlatNode>;
  dataSource: MatTreeFlatDataSource<Categoria, CategoriaFlatNode>;
  public categoria: Categoria;
  private nodo: CategoriaFlatNode;
  private expandedNodes: Set<string> = new Set<string>();
  private token: string | null;

  constructor(
    private _usuarioService: UsuarioService,
    private toastr: ToastrService,
    private _errorService: ErrorService,
    private router: Router,
    private dialog: MatDialog,
    private _exitoService: ExitoService) {
    this.categoria = new Categoria(0, '', '', 0, false);
    this.treeFlattener = new MatTreeFlattener(
      this.transformer.bind(this),
      node => node.level,
      node => node.expandable,
      node => node.categoria
    );
    this.token = localStorage.getItem('token');
    this.treeControl = new FlatTreeControl<CategoriaFlatNode>(
      node => node.level,
      node => node.expandable
    );
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
    this.nodo = { expandable: false, nombre_categoria: "", level: 0 }
  }

  abrirDialogEliminar(): void {
    if (this.categoria.categoria) {
      this._errorService.msjError(`No se puede eliminar la categoría ${this.categoria.nombre_categoria} porque contiene subcategorías.`)
    } else {
      const titulo = `¿Está seguro de que desea eliminar la categoría ${this.categoria.nombre_categoria}?`;
      const contenido = 'Esta acción eliminará permanentemente la categoría y todos los elementos asociados a ella.';
      const dialogRef = this.dialog.open(ConfirmarComponent, {
        width: '40%',
        data: { titulo, contenido },
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) { this.eliminarCategoria(this.categoria.id_categoria) }
      });
    }
  }
  abrirDialogActivar(event: any, node: CategoriaFlatNode): void {
    const categoria = this.buscarCategoria(this.dataSource.data, node)
    const dialogRef = this.dialog.open(ContenidoDialogoActivar, {
      width: '40%',
      data: categoria,
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.bloqueoOdesbloqueo(node);
        event.source.checked = event.source.checked;
      } else {
        event.source.checked = !event.source.checked;
      }
    });
  }
  buscarBloqueoCategoria(node: CategoriaFlatNode): boolean {
    const categoria = this.buscarCategoria(this.dataSource.data, node);
    if (categoria) {
      return categoria.bloqueado;
    } else {
      return false;
    }
  }

  private buscarCategoria(categorias: Categoria[], targetNode: CategoriaFlatNode): Categoria | null {
    for (const categoria of categorias) {
      if (categoria.nombre_categoria === targetNode.nombre_categoria) {
        return categoria;
      }
      if (categoria.categoria) {
        const foundCategoria = this.buscarCategoria(categoria.categoria, targetNode);
        if (foundCategoria) {
          return foundCategoria;
        }
      }
    }
    return null;
  }
  ngOnInit(): void {
    this.obtenerCategorias();
  }
  obtenerCategorias() {
    this._usuarioService.getCategorias().subscribe({
      next: (response) => {
        const categorias = this._usuarioService.organizarEnArbol(response);
        this.dataSource.data = categorias;
        this.restoreExpandedNodesState();
      },
    });
  }

  seleccionarNodo(node: CategoriaFlatNode): void {
    this.nodo = node;
    console.log(this.nodo)
    const categoria = this.buscarCategoria(this.dataSource.data, node);
    if (categoria) {
      this.categoria = categoria;
    }
  }
  
  private saveExpandedNodesState() {
    this.expandedNodes.clear();
    this.treeControl.dataNodes.forEach(node => {
      if (this.treeControl.isExpanded(node)) {
        this.expandedNodes.add(node.nombre_categoria);
      }
    });
  }
  private restoreExpandedNodesState() {
    this.treeControl.dataNodes.forEach(node => {
      if (this.expandedNodes.has(node.nombre_categoria)) {
        this.treeControl.expand(node);
      }
    });
  }
  hasChild = (_: number, node: CategoriaFlatNode) => node.expandable;
  transformer(node: Categoria, level: number): CategoriaFlatNode {
    return {
      expandable: !!node.categoria && node.categoria.length > 0,
      nombre_categoria: node.nombre_categoria,
      level: level,
    };
  }

  eliminarCategoria(id: number) {
    this._usuarioService.deleteCategoria(id).subscribe({
      next: (response) => {
        this.saveExpandedNodesState();
        this.obtenerCategorias();
        var accion= 'eliminado la categoría';
        var nombreObjeto = response.categoria.nombre_categoria;
        if (this.token) {
          this._usuarioService.notificar(this.token, accion, nombreObjeto).subscribe()
        };
        this._exitoService.mostrarExito(response);
      },
      error: (e: HttpErrorResponse) => {
        this._errorService.msjError(e);
      }
    });
  }

  agregarCategoria(id_categoria_padre: number) {
    this.router.navigate(['/add-category/', id_categoria_padre]);
  }

  bloqueoOdesbloqueo(node: CategoriaFlatNode) {
    const categoria = this.buscarCategoria(this.dataSource.data, node);
    if (categoria) {
      this._usuarioService.bloquearOdesbloquearCategoria(categoria.id_categoria).subscribe({
        next: (response) => {
          var accion;
          var nombreObjeto = response.nombre_categoria;
          if (response.bloqueado) {
            accion = 'activado la categoría';
          } else {
            accion = 'desactivado la categoría';
          }
          if (this.token) {
            this._usuarioService.notificar(this.token, accion, nombreObjeto).subscribe()
          };
          this._exitoService.mostrarExito(response);
        },
        error: (e: HttpErrorResponse) => {
          this._errorService.msjError(e);
        }
      });
    }
  }
}

import { CommonModule } from '@angular/common';
import { ConfirmarComponent } from 'src/app/dialogs/confirmar/confirmar.component';
import { ExitoService } from 'src/app/services/exito.service';

@Component({
  selector: 'dialog-content',
  template: `
    <h1 mat-dialog-title>
      {{ data.bloqueado ? 'Desactivar' : 'Activar' }}
    </h1>
    <mat-dialog-content class="mat-typography">
      <ng-container *ngIf="data.bloqueado; else categoriaNoBloqueada">
        ¿Estás seguro de que deseas desactivar la categoría {{data.nombre_categoria}}?
      </ng-container>
      <ng-template #categoriaNoBloqueada>
        ¿Estás seguro de que deseas activar la categoría {{data.nombre_categoria}}?
      </ng-template>
    </mat-dialog-content>
    <mat-dialog-actions class="" align="end">
      <button class="mr-2" color="warn" mat-raised-button mat-dialog-close>Cancelar</button>
      <button color="primary" mat-raised-button [mat-dialog-close]="true" cdkFocusInitial>Sí</button>
    </mat-dialog-actions>
  `,
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, CommonModule],
})
export class ContenidoDialogoActivar {
  constructor(
    public dialogRef: MatDialogRef<ContenidoDialogoActivar>,
    @Inject(MAT_DIALOG_DATA) public data: Categoria,
  ) { }
}

@Component({
  selector: 'dialog-content',
  template: `
    <h1 mat-dialog-title>Error</h1>
    <mat-dialog-content class="mat-typography">
      Esta categoría contiene subcategorías y no se puede eliminar
    </mat-dialog-content>
    <mat-dialog-actions class="" align="end">
      <button color="primary" mat-raised-button mat-dialog-close cdkFocusInitial>OK</button>
    </mat-dialog-actions>
  `,
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
})
export class ContenidoDialogoImposibleEliminar { }