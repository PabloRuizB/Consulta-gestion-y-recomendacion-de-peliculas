import { Component, Input } from '@angular/core';
import { DesignerState } from 'src/app/services/designer-state.service';

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss']
})
export class AvatarComponent {

  @Input() size :string = "md";

  private _initials: string;
  public get initials(): string{
    return this._initials;
  }

  public get gravatarId(): string {
    return this.designerState.user.gravatarId;
  }

  public get bgImage(): string {
    if(this.gravatarId)
      return "background-image: url(https://s.gravatar.com/avatar/"+ this.gravatarId +"?s=50);";
    else
      return "";
  }
  constructor(private designerState: DesignerState){}

  ngOnInit(){
    var userName = this.designerState.user.user_name;
    var inits = "";
    userName.split(" ").forEach(word => inits += word[0]);

    this._initials = inits;
  }
}
