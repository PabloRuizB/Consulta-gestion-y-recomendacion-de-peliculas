import { Component, ElementRef, HostListener, Input, inject } from "@angular/core";
import { APIService } from "src/app/services/api.service";
import { DesignerState } from "src/app/services/designer-state.service";
@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss']
})
export class UserInfoComponent{

  @Input() isHidden: boolean = true;
  @Input() toolbarClicked

  public get user_name(): string {
    return this.designerState.user.user_name;
  }

  public get email(): string {
    return this.designerState.user.email;
  }

  //9cf89e0cae4530afe54fee0e51663860
  public get gravatar_id(): string {
    return this.designerState.user.gravatarId;
  }

  public set gravatar_id(value: string) {
    this.designerState.user.gravatarId = value;
  }

  private designerState: DesignerState = inject(DesignerState);

  constructor(private elementRef: ElementRef, private apiService: APIService) {}

  setGravatarId() {
    this.apiService.setUserGravatar(this.designerState.user.user_id, this.designerState.user.gravatarId);
  }

}
