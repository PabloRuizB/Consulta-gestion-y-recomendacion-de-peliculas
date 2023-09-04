import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ContentEnum } from '../core/content-enum';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationsService } from '../services/authentication.service';
import { User } from '../core/user';
import { DesignerState } from '../services/designer-state.service';

@Component({
  selector: 'app-designer',
  templateUrl: './designer.component.html',
  styleUrls: ['./designer.component.scss'],
})
export class DesignerComponent {

  options = this._formBuilder.group({
    bottom: 0,
    fixed: false,
    top: 0,
  });
  public contentDisplayed: ContentEnum;

  ngOnInit(): void {
    // Accede a los datos resueltos de la ruta
    this.designerState.user = this.designerState.user ?? <User>this.route.snapshot.data['userData'];
  }

  constructor(private _formBuilder: FormBuilder, private router: Router, private authService: AuthenticationsService, private route: ActivatedRoute, private designerState: DesignerState) {}

  displayContent(content_id: string) {
    switch (content_id) {
      case 'catalog':
        this.router.navigate(['designer', {outlets: { designerContent: ['catalog']}}]);
        break;
      case 'my-list':
        this.router.navigate(['designer', {outlets: { designerContent: ['userMovies']}}]);
        break;
      case 'pending':
        this.router.navigate(['designer', {outlets: { designerContent: ['userPendingMovies']}}]);
        break;
      case 'recommendations':
        this.router.navigate(['designer', {outlets: { designerContent: ['recomender']}}]);
        break;
    }
  }


  logout() {
    this.authService.removeToken();
    window.location.reload();
  }
}
