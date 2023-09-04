import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialComponentsModule } from '../material.module';
import { MovieComponent } from '../components/movie/movie.component';
import { AvatarComponent } from './toolbar/avatar/avatar.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { DesignerComponent } from './designer.component';
import { CommonModule } from '@angular/common';
import { DesignerRoutingModule } from './designer-routing.module';
import { CatalogComponent } from './catalog/catalog.component';
import { SearchBarComponent } from '../components/search-bar/search-bar.component';
import { UserMoviesComponent } from './user_movies/user_movies.component';
import { DesiredListComponent } from './desired_list/desired_list.component';
import { UserInfoComponent } from './user-info/user-info.component';
import { RatingComponent } from '../components/rating/rating.component';
import { RecomenderComponent } from './recomender/recomender.component';
import { ColdInitComponent } from './recomender/cold-init/cold-init.component';
import { RecomendedMoviesComponent } from './recomender/recomended-movies/recomended-movies.component';


@NgModule({
  declarations: [
    ToolbarComponent,
    AvatarComponent,
    MovieComponent,
    CatalogComponent,
    UserMoviesComponent,
    SearchBarComponent,
    DesignerComponent,
    DesiredListComponent,
    UserInfoComponent,
    RatingComponent,
    RecomenderComponent,
    ColdInitComponent,
    RecomendedMoviesComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialComponentsModule,
    DesignerRoutingModule
  ],
  providers: [],
})
export class DesignerModule { }
