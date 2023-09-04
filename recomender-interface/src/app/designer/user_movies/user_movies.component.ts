import { Component, inject } from '@angular/core';
import { CatalogComponent } from '../catalog/catalog.component';
import { DesignerState } from 'src/app/services/designer-state.service';

@Component({
  selector: 'app-user-movies',
  templateUrl: '../catalog/catalog.component.html',
  styleUrls: ['../catalog/catalog.component.scss'],
})
export class UserMoviesComponent extends CatalogComponent {

  private designerState: DesignerState = inject(DesignerState);

  public override get title(): string {
    return "Lista de peliculas vistas";
  }

  protected override getMovies() {
    this.apiService
      .getUserRatings(this.page_number, this.page_size, this._order_field + ' ' + this._order_type, this.filter, this.designerState.user.user_id)
      .then((movies) => {
        this.movies = movies;
        this.tmdbService
          .getFilmsInfo(movies.map((m) => m.id))
          .then((dataResponse) => {
            this.movies = dataResponse;
          });
      });
  }
}
