import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoginComponent } from './components/login/login.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { HomeComponent } from './components/home/home.component';
import { AuthGuard } from './utils/auth.guard';
import { EditarPerfilComponent } from './components/editar-perfil/editar-perfil.component';
import { AccesoComponent } from './components/acceso/acceso.component';
import { RestrictionSignLoginGuard } from './utils/restriction-sign-login.guard';
import { RestrictionPerfil } from './utils/restriction-perfil';
import { AgregarCategoriaComponent } from './components/agregar-categoria/agregar-categoria.component';
import { AgregarSubcategoriaComponent } from './components/agregar-subcategoria/agregar-subcategoria.component';
import { SignInAdminComponent } from './components/sign-in-admin/sign-in-admin.component';
import { AccesoAdminComponent } from './components/acceso-admin/acceso-admin.component';
import { LoginAdminComponent } from './components/login-admin/login-admin.component';
import { EditarPerfilAdminComponent } from './components/editar-perfil-admin/editar-perfil-admin.component';

//guards
const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'login', component: LoginComponent, canActivate: [RestrictionSignLoginGuard]  },
  { path: 'acceso', component: AccesoComponent, canActivate: [RestrictionSignLoginGuard]  },
  { path: 'signin', component: SignInComponent, canActivate: [RestrictionSignLoginGuard]  },
  { path: 'update-perfil/:id', component: EditarPerfilComponent, canActivate: [RestrictionPerfil]  },
  //admin
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'login/admin', component: LoginAdminComponent, canActivate: [RestrictionSignLoginGuard]  },
  { path: 'acceso/admin', component: AccesoAdminComponent, canActivate: [RestrictionSignLoginGuard]  },
  { path: 'admin', component: SignInAdminComponent, canActivate: [RestrictionSignLoginGuard] },
  { path: 'create-user', component: SignInComponent, canActivate: [AuthGuard]  },
  { path: 'create-admin', component: SignInAdminComponent, canActivate: [AuthGuard]  },
  { path: 'update-perfil-admin/:id', component: EditarPerfilAdminComponent, canActivate: [RestrictionPerfil]  },
  { path: 'add-category', component: AgregarCategoriaComponent, canActivate: [AuthGuard] },
  { path: 'add-subcategory', component: AgregarSubcategoriaComponent, canActivate: [AuthGuard] },
  { path: 'edit-category/:id', component: AgregarCategoriaComponent, canActivate: [AuthGuard] },
  { path: 'edit-subcategory/:id', component: AgregarSubcategoriaComponent, canActivate: [AuthGuard] },
  //
  { path: '**', component: HomeComponent, pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
