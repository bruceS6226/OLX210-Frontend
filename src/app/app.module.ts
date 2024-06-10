import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SpinnerComponent } from './shared/spinner/spinner.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { HomeComponent } from './components/home/home.component';
import { AddTokenInterceptor } from './utils/add-token.interceptor';
import { EditarPerfilComponent } from './components/editar-perfil/editar-perfil.component';
import { AccesoComponent } from './components/acceso/acceso.component';
import { AgregarCategoriaComponent } from './components/agregar-categoria/agregar-categoria.component';
import { AgregarSubcategoriaComponent } from './components/agregar-subcategoria/agregar-subcategoria.component';
import { SignInAdminComponent } from './components/sign-in-admin/sign-in-admin.component';
import { LoginAdminComponent } from './components/login-admin/login-admin.component';
import { AccesoAdminComponent } from './components/acceso-admin/acceso-admin.component';
import { MatIconModule } from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { UsuariosClientesComponent } from './components/usuarios-clientes/usuarios-clientes.component';
import { UsuariosAdministradoresComponent } from './components/usuarios-administradores/usuarios-administradores.component';
import {MatTabsModule} from '@angular/material/tabs';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import {MatDialogModule} from '@angular/material/dialog';
import { CategoriaArbolComponent } from './components/categoria-arbol/categoria-arbol.component';
import {MatTreeModule} from '@angular/material/tree';
import {MatMenuModule} from '@angular/material/menu';
import { CommonModule } from '@angular/common';
import { AyudaUsuarioComponent } from './components/ayuda-usuario/ayuda-usuario.component';
import { CambiarContraseniaComponent } from './components/cambiar-contrasenia/cambiar-contrasenia.component';
import { ConfirmarComponent } from './dialogs/confirmar/confirmar.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignInComponent,
    DashboardComponent,
    NavbarComponent,
    SpinnerComponent,
    HomeComponent,
    EditarPerfilComponent,
    AccesoComponent,
    AgregarCategoriaComponent,
    AgregarSubcategoriaComponent,
    SignInAdminComponent,
    LoginAdminComponent,
    AccesoAdminComponent,
    UsuariosClientesComponent,
    UsuariosAdministradoresComponent,
    CategoriaArbolComponent,
    AyudaUsuarioComponent,
    CambiarContraseniaComponent,
    ConfirmarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      timeOut: 5000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
    }),
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatTabsModule,
    MatSlideToggleModule,
    MatButtonToggleModule,
    MatInputModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatSelectModule,
    MatDialogModule,
    MatTreeModule,
    MatMenuModule,
    CommonModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AddTokenInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
