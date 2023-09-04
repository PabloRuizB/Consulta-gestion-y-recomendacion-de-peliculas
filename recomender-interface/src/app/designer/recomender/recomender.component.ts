import { Component } from '@angular/core';
import { APIService } from 'src/app/services/api.service';
import { DesignerState } from 'src/app/services/designer-state.service';

@Component({
  selector: 'app-recomender',
  templateUrl: './recomender.component.html',
  styleUrls: ['./recomender.component.scss']
})
export class RecomenderComponent {

  public coldInitCompleted = false;
  public moviesIds = [];

  constructor(private apiService: APIService, private desigerState: DesignerState) {}

  ngOnInit() {
    this.apiService.getRecomendations(this.desigerState.user.user_id)
      .then(res => {
        this.coldInitCompleted = res.coldInitCompleted;
        this.moviesIds = res.movies;
      })
  }
}
