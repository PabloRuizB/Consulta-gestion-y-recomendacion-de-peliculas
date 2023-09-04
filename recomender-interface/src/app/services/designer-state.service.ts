import { Injectable } from "@angular/core";
import { User } from "../core/user";


@Injectable({
  providedIn: 'root',
})
export class DesignerState {

  public user: User;

}
