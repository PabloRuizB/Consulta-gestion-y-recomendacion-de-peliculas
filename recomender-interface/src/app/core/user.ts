export class User {
  user_id: number;
  user_name: string;
  email: string;
  password: string;
  gravatarId: string;

  constructor(email: string, password: string, user_id: number = -1, user_name: string = "", gravatarId: string = ""){
    this.user_id = user_id;
    this.user_name = user_name;
    this.email = email;
    this.password = password;
    this.gravatarId = gravatarId;
  }
}
