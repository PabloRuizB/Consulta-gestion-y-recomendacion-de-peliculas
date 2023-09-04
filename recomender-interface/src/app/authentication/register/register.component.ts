import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/core/user';
import { APIService } from 'src/app/services/api.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  public user_name: string;
  public mail: string;
  public password: string;
  public password_confirmation: string;
  public errorMsg: string = '';

  public api = inject(APIService);
  public router = inject(Router);

  public onSubmit() {
    if (!this.checkRegisterUser()) return;

    var user = new User(this.mail, this.password, -1, this.user_name);
    this.api.registerUser(user).then((dataResponse) => {
      if (dataResponse?.suscess ?? false) {
        this.router.navigate(['/login']);
      } else
        this.errorMsg = dataResponse?.message ?? "Ha habido un error de conexión con el sevidor";
    });
  }

  private checkRegisterUser(): boolean {
    this.errorMsg = "";
    if (this.user_name.length == 0)
      this.errorMsg = 'Introduzca un nombre de usuario valido';
    else if(!this.mail.includes('@'))
      this.errorMsg = 'Debe introducir un formato de email correcto';
    else if (this.password != '' && this.password_confirmation != '')
      this.errorMsg =
        this.password == this.password_confirmation
          ? ''
          : 'Las contraseñas deben coincidir';

    return this.errorMsg.length == 0;
  }
}
