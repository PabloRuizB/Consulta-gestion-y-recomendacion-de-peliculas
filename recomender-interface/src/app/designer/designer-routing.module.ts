import { NgModule } from '@angular/core';
import { DesignerComponent } from './designer.component';
import { RouterModule, Routes } from '@angular/router';
import { CatalogComponent } from './catalog/catalog.component';
import { MovieComponent } from '../components/movie/movie.component';
import { UserMoviesComponent } from './user_movies/user_movies.component';
import { DesiredListComponent } from './desired_list/desired_list.component';
import { RecomenderComponent } from './recomender/recomender.component';

const routes: Routes = [
  {
    path: '',
    component: DesignerComponent,
    children: [
      {
        path: 'catalog',
        component: CatalogComponent,
        outlet: 'designerContent'
      },
      {
        path: 'userMovies',
        component: UserMoviesComponent,
        outlet: 'designerContent'
      },
      {
        path: 'userPendingMovies',
        component: DesiredListComponent,
        outlet: 'designerContent'
      },
      {
        path: 'recomender',
        component: RecomenderComponent,
        outlet: 'designerContent'
      },
      {
        path: 'movie/:id',
        component: MovieComponent,
        outlet: 'designerContent'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DesignerRoutingModule {}
