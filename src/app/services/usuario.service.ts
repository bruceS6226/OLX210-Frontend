import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Usuario } from '../interfaces/usuario';
import { Observable } from 'rxjs';
import { TiposUsuario } from '../interfaces/tiposUsuario';
import { TiposDocumento } from '../interfaces/tiposDocumento';
import { ClasesUsuario } from '../interfaces/clasesUsuario';
import { Subcategoria } from '../interfaces/subCategoria';
import { Categoria } from '../interfaces/categoria';
import { Administrador } from '../interfaces/adminstrador';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private myAppUrl: string;
  private myApiUrl: string;

  constructor(private http: HttpClient) {
    this.myAppUrl = environment.url;
    this.myApiUrl = 'api/users/'
  }

  //usuarios
  guardarUsuario(user: Usuario): Observable<any> {
    return this.http.post(`${this.myAppUrl}${this.myApiUrl}usuario`, user);
  }
  login(user: Usuario): Observable<any> {
    return this.http.post<any>(`${this.myAppUrl}${this.myApiUrl}usuario/login`, user)
  }
  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.myAppUrl}${this.myApiUrl}usuarios`)
  }
  deleteUsuario(id: number): Observable<void> {
    return this.http.delete<void>(`${this.myAppUrl}${this.myApiUrl}usuario/${id}`)
  }
  getUsuario(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.myAppUrl}${this.myApiUrl}usuario/${id}`)
  }
  updateUsuario(id: number, user: Usuario): Observable<void> {
    return this.http.put<void>(`${this.myAppUrl}${this.myApiUrl}usuario/${id}`, user);
  }

  //administradores
  guardarAdministrador(administrador: Administrador): Observable<any> { // Cambiar el nombre y el tipo de parámetro
    return this.http.post(`${this.myAppUrl}${this.myApiUrl}admin`, administrador); // Cambiar el nombre del parámetro
  }
  loginAdmin(administrador: Administrador): Observable<any> { // Cambiar el nombre y el tipo de parámetro
    return this.http.post<any>(`${this.myAppUrl}${this.myApiUrl}admin/login`, administrador); // Cambiar el nombre del parámetro
  }
  getAdministradores(): Observable<Administrador[]> { // Cambiar el tipo de retorno
    return this.http.get<Administrador[]>(`${this.myAppUrl}${this.myApiUrl}administradores`); // Cambiar el tipo de retorno
  }
  deleteAdministrador(id: number): Observable<void> { // Cambiar el nombre y el tipo de parámetro
    return this.http.delete<void>(`${this.myAppUrl}${this.myApiUrl}admin/${id}`); // Cambiar el nombre del parámetro
  }
  getAdministrador(id: number): Observable<Administrador> { // Cambiar el tipo de retorno
    return this.http.get<Administrador>(`${this.myAppUrl}${this.myApiUrl}admin/${id}`); // Cambiar el tipo de retorno
  }
  updateAdministrador(id: number, administrador: Administrador): Observable<void> { // Cambiar el nombre y el tipo de parámetro
    return this.http.put<void>(`${this.myAppUrl}${this.myApiUrl}admin/${id}`, administrador); // Cambiar el nombre del parámetro
  }

  //imagen
  updateImage(id: number, foto: File): Observable<void> {
    const formData = new FormData();
    if (foto) {
      formData.append('foto', foto);
    }
    return this.http.put<void>(`${this.myAppUrl}${this.myApiUrl}${id}`, formData);
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
  deleteCategoria(id: number): Observable<void> {
    return this.http.delete<void>(`${this.myAppUrl}${this.myApiUrl}category/${id}`)
  }
  getCategoria(id: number): Observable<Categoria> {
    return this.http.get<Categoria>(`${this.myAppUrl}${this.myApiUrl}category/${id}`)
  }
  updateCategoria(id: number, category: Categoria): Observable<void> {
    return this.http.put<void>(`${this.myAppUrl}${this.myApiUrl}category/${id}`, category);
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
  getSubcategoria(id: number): Observable<Subcategoria> {
    return this.http.get<Subcategoria>(`${this.myAppUrl}${this.myApiUrl}subcategory/${id}`)
  }
  updateSubcategoria(id: number, subcategory: Subcategoria): Observable<void> {
    return this.http.put<void>(`${this.myAppUrl}${this.myApiUrl}subcategory/${id}`, subcategory);
  }
}