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
import { NavbarusuarioComponent } from './components/navbarusuario/navbarusuario.component';
import { HomeComponent } from './components/home/home.component';
import { AddTokenInterceptor } from './utils/add-token.interceptor';
import { EditarPerfilComponent } from './components/editar-perfil/editar-perfil.component';
import { AccesoComponent } from './components/acceso/acceso.component';
import { AgregarCategoriaComponent } from './components/agregar-categoria/agregar-categoria.component';
import { AgregarSubcategoriaComponent } from './components/agregar-subcategoria/agregar-subcategoria.component';
import { SignInAdminComponent } from './components/sign-in-admin/sign-in-admin.component';
import { NavbarAdminComponent } from './components/navbar-admin/navbar-admin.component';
import { EditarPerfilAdminComponent } from './components/editar-perfil-admin/editar-perfil-admin.component';
import { LoginAdminComponent } from './components/login-admin/login-admin.component';
import { AccesoAdminComponent } from './components/acceso-admin/acceso-admin.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignInComponent,
    DashboardComponent,
    NavbarComponent,
    SpinnerComponent,
    NavbarusuarioComponent,
    HomeComponent,
    EditarPerfilComponent,
    AccesoComponent,
    AgregarCategoriaComponent,
    AgregarSubcategoriaComponent,
    SignInAdminComponent,
    NavbarAdminComponent,
    EditarPerfilAdminComponent,
    LoginAdminComponent,
    AccesoAdminComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      timeOut: 4000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
    }),
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AddTokenInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
