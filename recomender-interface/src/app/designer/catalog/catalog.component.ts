import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Movie } from 'src/app/core/movie';
import { APIService } from 'src/app/services/api.service';
import { TMDBService } from 'src/app/services/tmdb.service';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.scss'],
})
export class CatalogComponent {
  protected apiService: APIService = inject(APIService);
  protected tmdbService: TMDBService = inject(TMDBService);
  public movies: Movie[];

  public page_number: number = 0;
  public page_size: number = 50;
  public filter: string = '';
  // public order: string = 'id DESC';

  protected _order_field: string = 'title';
  protected _order_type: string = 'asc';

  public get order_field(): string {
    return this._order_field;
  }
  public set order_field(value: string) {
    this._order_field = value;
    this.onSearch(this.filter);
  }

  public get order_type(): string {
    return this._order_type;
  }
  public set order_type(value: string) {
    this._order_type = value;
    this.onSearch(this.filter);
  }

  public get title(): string {
    return "Catálogo";
  }

  constructor(protected router: Router){}

  ngOnInit() {
    this.getMovies();
  }

  public onSearch(searchText: string) {
    this.filter = searchText;
    this.getMovies();
  }

  protected getMovies() {
    this.apiService
      .getCatalog(this.page_number, this.page_size, this._order_field + ' ' + this._order_type, this.filter)
      .then((movies) => {
        this.movies = movies;
        this.tmdbService
          .getFilmsInfo(movies.map((m) => m.id))
          .then((dataResponse) => {
            this.movies = dataResponse;
          });
      });
  }

  showMovieDetail(movie: Movie) {
    this.router.navigate(['designer',{outlets: { designerContent: ['movie', movie.id]}}]);
  }

  refreshSearchText(searchText: string){
    this.filter = searchText;
  }

  pageBefore(){
    this.page_number -= 1;
    this.onSearch(this.filter);
  }

  pageNext(){
    this.page_number += 1;
    this.onSearch(this.filter);
  }
}
