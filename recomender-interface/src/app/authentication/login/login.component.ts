import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/core/user';
import { APIService } from 'src/app/services/api.service';
import { DesignerState } from 'src/app/services/designer-state.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  public mail: string;
  public password: string;

  public errorMsg: string = "";

  public api = inject(APIService);
  public router = inject(Router);
  public designerState = inject(DesignerState);

  public onSubmit(){
    this.api.loginUser(this.mail, this.password)
      .then(user => {
        if(user){
          var usr: User = new User(user.email, user.password, user.user_id, user.user_name, user.gravatarId ?? "")
          this.designerState.user = usr;
          this.router.navigate(['/designer']);
        }
        else
          this.errorMsg = "Usuario o contraseña incorrectos"});
  }

}
