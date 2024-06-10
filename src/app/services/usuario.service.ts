import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Usuario } from '../interfaces/usuario';
import { Observable, tap } from 'rxjs';
import { TiposUsuario } from '../interfaces/tiposUsuario';
import { TiposDocumento } from '../interfaces/tiposDocumento';
import { ClasesUsuario } from '../interfaces/clasesUsuario';
import { Subcategoria } from '../interfaces/subCategoria';
import { Categoria } from '../interfaces/categoria';
import { Comportamiento } from '../interfaces/comportamiento';
import { EstadoDatos } from '../interfaces/estadoDatos';


@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private myAppUrl: string;
  private myApiUrl: string;
  public usuarioActual: Usuario | null;

  constructor(private http: HttpClient) {
    this.myAppUrl = environment.url;
    this.myApiUrl = 'api/users/';
    const usuarioGuardado = localStorage.getItem('user');
    this.usuarioActual = usuarioGuardado ? JSON.parse(usuarioGuardado) : null;
  }

  //usuarios
  guardarUsuario(user: Usuario): Observable<any> {
    return this.http.post(`${this.myAppUrl}${this.myApiUrl}usuario`, user);
  }
  login(user: Usuario): Observable<any> {
    return this.http.post<any>(`${this.myAppUrl}${this.myApiUrl}usuario/login`, user).pipe(
      tap((response: any) => {
      })
    );
  }
  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.myAppUrl}${this.myApiUrl}usuarios`)
  }
  deleteUsuario(id: number): Observable<any> {
    return this.http.delete<any>(`${this.myAppUrl}${this.myApiUrl}usuario/${id}`)
  }
  getUsuario(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.myAppUrl}${this.myApiUrl}usuario/${id}`)
  }
  updateUsuario(id: number, user: Usuario): Observable<any> {
    return this.http.put<any>(`${this.myAppUrl}${this.myApiUrl}usuario/${id}`, user);
  }
  bloquearOdesbloquearUsuario(id: number): Observable<any>{
    return this.http.put<any>(`${this.myAppUrl}${this.myApiUrl}bloquear-o-desbloquear-usuario/${id}`, null);
  }
  comprobarExistenciaUsuario(atributo: string, usuario: Usuario): Observable<boolean>{
    return this.http.post<boolean>(`${this.myAppUrl}${this.myApiUrl}comprobar-usuario/${atributo}`, usuario);
  }
  //correo
  reenviarCorreo(token:string): Observable<any>{
    return this.http.post(`${this.myAppUrl}${this.myApiUrl}verificar-correo/${token}`, null);
  }
  validarCorreo(token:string): Observable<any>{
    return this.http.post(`${this.myAppUrl}${this.myApiUrl}validar-correo/${token}`, null);
  }
  cambiarContrasenia(token:string): Observable<boolean>{
    return this.http.post<boolean>(`${this.myAppUrl}${this.myApiUrl}cambiar-contrasenia/${token}`, null);
  }
  validarOTP(otp:string): Observable<boolean>{
    return this.http.post<boolean>(`${this.myAppUrl}${this.myApiUrl}validar-otp/${otp}`, null);
  }
  actualizarContrasenia(token: string, contrasenia: string): Observable<any>{
    const body = { contrasenia: contrasenia };
    return this.http.post(`${this.myAppUrl}${this.myApiUrl}restablecer-contrasenia/${token}`, body)
  }
  notificar(token: string, accion: string, nombreObjeto: string): Observable<boolean>{
    const body = { token: token, accion: accion, nombreObjeto: nombreObjeto };
    return this.http.post<boolean>(`${this.myAppUrl}${this.myApiUrl}notificar/${token}`, body);
  }

  //imagen
  updateImage(id: number, foto: File): Observable<void> {
    const formData = new FormData();
    if (foto) {
      formData.append('foto', foto);
    }
    return this.http.put<void>(`${this.myAppUrl}${this.myApiUrl}usuario/${id}`, formData);
  }
  getImage(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.myAppUrl}${this.myApiUrl}${id}`)
  }

  //tipos de usuario
  getTiposUsuario(): Observable<TiposUsuario[]> {
    return this.http.get<TiposUsuario[]>(`${this.myAppUrl}${this.myApiUrl}types-user`)
  }
  getTipoUsuario(id_tipo_usuario: number): Observable<TiposUsuario> {
    return this.http.get<TiposUsuario>(`${this.myAppUrl}${this.myApiUrl}types-user/${id_tipo_usuario}`)
  }

  //tipos de documento
  getTiposDocumento(): Observable<TiposDocumento[]> {
    return this.http.get<TiposDocumento[]>(`${this.myAppUrl}${this.myApiUrl}types-document`)
  }
  getTipoDocumento(id_tipo_documento: number): Observable<TiposDocumento> {
    return this.http.get<TiposDocumento>(`${this.myAppUrl}${this.myApiUrl}types-document/${id_tipo_documento}`)
  }

  //clases de usuario
  getClasesUsuario(): Observable<ClasesUsuario[]> {
    return this.http.get<ClasesUsuario[]>(`${this.myAppUrl}${this.myApiUrl}classes-user`)
  }
  getClaseUsuario(id_clase_usuario: number): Observable<ClasesUsuario> {
    return this.http.get<ClasesUsuario>(`${this.myAppUrl}${this.myApiUrl}classes-user/${id_clase_usuario}`)
  }

  //categorias
  guardarCategoria(category: Categoria): Observable<any> {
    return this.http.post(`${this.myAppUrl}${this.myApiUrl}createCategory`, category);
  }
  getCategorias(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(`${this.myAppUrl}${this.myApiUrl}categories`)
  }
  deleteCategoria(id: number): Observable<any> {
    return this.http.delete<any>(`${this.myAppUrl}${this.myApiUrl}category/${id}`)
  }
  getCategoria(id: number): Observable<Categoria> {
    return this.http.get<Categoria>(`${this.myAppUrl}${this.myApiUrl}category/${id}`)
  }
  updateCategoria(id: number, category: Categoria): Observable<any> {
    return this.http.put<any>(`${this.myAppUrl}${this.myApiUrl}category/${id}`, category);
  }
  bloquearOdesbloquearCategoria(id: number): Observable<any>{
    return this.http.put<any>(`${this.myAppUrl}${this.myApiUrl}bloquear-o-desbloquear-category/${id}`, null);
  }

  //subcategorias
  guardarSubcategoria(subcategory: Subcategoria): Observable<any> {
    return this.http.post(`${this.myAppUrl}${this.myApiUrl}createSubcategory`, subcategory);
  }
  getSubcategorias(): Observable<Subcategoria[]> {
    return this.http.get<Subcategoria[]>(`${this.myAppUrl}${this.myApiUrl}subcategories`)
  }
  deleteSubcategoria(id: number): Observable<void> {
    return this.http.delete<void>(`${this.myAppUrl}${this.myApiUrl}subcategory/${id}`)
  }
  updateSubcategoria(id: number, subcategory: Subcategoria): Observable<void> {
    return this.http.put<void>(`${this.myAppUrl}${this.myApiUrl}subcategory/${id}`, subcategory);
  }
  getSubcategoria(id: number): Observable<Subcategoria> {
    return this.http.get<Subcategoria>(`${this.myAppUrl}${this.myApiUrl}subcategory/${id}`)
  }
  organizarEnArbol(categorias: Categoria[]): Categoria[] {
    const categoriasArbol: Categoria[] = [];
    const categoriasMap = new Map<number, Categoria>();

    categorias.forEach(categoria => {
      categoriasMap.set(categoria.id_categoria, categoria);
      if (!categoria.id_categoria_padre) {
        categoriasArbol.push(categoria);
      } else {
        const padre = categoriasMap.get(categoria.id_categoria_padre);
        if (padre) {
          if (!padre.categoria) {
            padre.categoria = [];
          }
          padre.categoria.push(categoria);
        }
      }
    });

    return categoriasArbol;
  }
  //comportamiento
  getComportamiento(id: number): Observable<Comportamiento> {
    return this.http.get<Comportamiento>(`${this.myAppUrl}${this.myApiUrl}comportamiento/${id}`);
  }
  getComportamientos(): Observable<Comportamiento[]> {
    return this.http.get<Comportamiento[]>(`${this.myAppUrl}${this.myApiUrl}comportamientos`);
  }
  updateComportamiento(id: number, valor: string): Observable<Comportamiento> {
    return this.http.put<Comportamiento>(`${this.myAppUrl}${this.myApiUrl}comportamiento/${id}/${valor}`, null);
  }
  //estado datos
  getEstadoDatos(id: number): Observable<EstadoDatos>{
    return this.http.get<EstadoDatos>(`${this.myAppUrl}${this.myApiUrl}estado-datos/${id}`);
  }
  updateEstadoDatos(id: number, estadoDatos: EstadoDatos): Observable<void>{
    return this.http.put<void>(`${this.myAppUrl}${this.myApiUrl}estado-datos/${id}`, estadoDatos);
  }
}