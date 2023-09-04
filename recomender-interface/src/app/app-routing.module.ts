import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/authentication.guard';
import { DesignerComponent } from './designer/designer.component';
import { UserResolver } from './resolvers/user.resolver';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'authentication/login',
    pathMatch: 'full'
  },
  {
    path: 'authentication',
    loadChildren: () =>
      import('./authentication/authentication.module').then(
        (m) => m.AuthenticationModule
      ),
  },
  {
    path: 'designer',
    loadChildren: () =>
        import('./designer/designer.module').then((m) => m.DesignerModule),
        canActivate: [AuthGuard],
        resolve: { userData: UserResolver } // Agrega el resolver a la ruta
  },
  {
    path: '**',
    redirectTo: 'authentication/login'
  },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
