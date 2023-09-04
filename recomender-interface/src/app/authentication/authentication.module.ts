import { NgModule } from '@angular/core';

// import { NgxStarRatingModule } from 'ngx-star-rating';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialComponentsModule } from '../material.module';
import { LoginComponent } from './login/login.component';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RegisterComponent } from './register/register.component';


const routes: Routes = [
  {path: '', component: LoginComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent}
]
@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent
  ],
  imports: [
    CommonModule,
    // NgxStarRatingModule,
    FormsModule,
    MaterialComponentsModule,
    RouterModule.forChild(routes)
  ],
  providers: [],
})
export class AuthenticationModule { }
