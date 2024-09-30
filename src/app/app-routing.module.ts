import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CrearTareaComponent } from '../app/componentes/tareas/crear-tarea/crear-tarea.component';
import { ObtenerTodosComponent } from '../app/componentes/usuarios/obtener-todos/obtener-todos.component';
import { GuardarUsuarioComponent } from '../app/componentes/usuarios/guardar-usuario/guardar-usuario.component';
import { ObtenerTodasTareasComponent } from '../app/componentes/tareas/obtener-todas-tareas/obtener-todas-tareas.component';
import { ActualizarTareaComponent } from '../app/componentes/tareas/actualizar-tarea/actualizar-tarea.component';
import { LoginComponent } from '../app/componentes/general/login/login.component';
import { AccessDeniedComponent } from '../app/componentes/general/access-denied/access-denied.component';
import { ActualizarUsuarioComponent } from '../app/componentes/usuarios/actualizar-usuario/actualizar-usuario.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'usuario-actualizar', component: ActualizarUsuarioComponent },
  { path: 'actualizar-tarea', component: ActualizarTareaComponent},
  { path: 'access-denied', component: AccessDeniedComponent  },
  { path: 'obtener-todas-tareas', component: ObtenerTodasTareasComponent },
  //{ path: 'guardar-usuario', component: GuardarUsuarioComponent },
  { path: 'obtener-todos-usuarios', component: ObtenerTodosComponent },
  { path: 'crear-tarea', component: CrearTareaComponent },
  { path: '**', component: ObtenerTodosComponent },
  { path: '', component: ObtenerTodosComponent } 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
