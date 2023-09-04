import { Component, EventEmitter, Input, Output, inject } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { map, switchMap } from "rxjs";
import { Movie } from "src/app/core/movie";
import { MovieCast } from "src/app/core/movie-cast";
import { CastRoleEnum } from "src/app/core/movie-cast-role";
import { APIService } from "src/app/services/api.service";
import { DesignerState } from "src/app/services/designer-state.service";
import { TMDBService } from "src/app/services/tmdb.service";

@Component({
  selector: 'app-movie',
  templateUrl: './movie.component.html',
  styleUrls: ['./movie.component.scss']
})
export class MovieComponent{

  @Input() movie: Movie;
  // @Output() movieRated = new EventEmitter<void>();

  private tmdb: TMDBService = inject(TMDBService);
  private activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private apiService: APIService = inject(APIService);
  private designerState: DesignerState = inject(DesignerState);

  @Input() tmbd_id: string = "";
  @Input() isColdInitMovie: boolean = false;
  @Output() nextClicked: EventEmitter<void> = new EventEmitter<void>();

  public actors: string;
  public directors: string;
  public writters: string;

  public isPending: boolean = true;

  ngOnInit() {
    this.activatedRoute.params.pipe(
      map(params => params['id']),
      switchMap(id => {
        if(id)
          this.tmbd_id = id;
        return this.tmdb.getFilmInfo(this.tmbd_id);
      })
    ).subscribe(film => {
      this.movie = film;
      this.tmdb.getFilmCast(this.tmbd_id).then((cast: MovieCast[]) => {
        this.actors = cast.filter(c => c.role == CastRoleEnum.Actor).map(c => c.name).join(', ');
        this.directors = cast.filter(c => c.role == CastRoleEnum.Director).map(c => c.name).join(', ');
        this.writters = cast.filter(c => c.role == CastRoleEnum.Writting).map(c => c.name).join(', ');
      }).then(() => {
        this.apiService.isPendingMovie(this.designerState.user.user_id, this.movie.id)
          .then(isPending => {
            this.isPending = isPending;
            this.apiService.movieRating(this.designerState.user.user_id, this.movie.id).then(rating => this.rating = rating);
          });
      });
    });
  }

  public get name(): string{
    return this.movie?.title ?? "";
  }

  public get source(): string{
    return this.movie ? 'https://image.tmdb.org/t/p/original'+ this.movie.image : "";
  }

  public get sinapsis(): string {
    return this.movie?.sinapsis;
  }

  public get genres(): string {
    return this.movie?.genres.join(', ');
  }

  public get rating(): number{
    return this.movie?.rating ?? 0;
  }

  public set rating(value: number){
    this.movie.rating = value;
    // this.movieRated.emit();
  }

  public addToPending() {
    this.apiService.addMovieToPendingUser(this.designerState.user.user_id, this.movie.id)
        .then(ret => {
          this.isPending = ret ? !this.isPending : this.isPending;
        });
  }

  public removeFromPending() {
    this.apiService.removeMovieFromPendingUser(this.designerState.user.user_id, this.movie.id)
        .then(ret => {
          this.isPending = ret ? !this.isPending : this.isPending;
        });
  }

  public rateMovie(event: number) {
    this.apiService.addRating(this.designerState.user.user_id, this.movie.id, event);
  }

  public onNextClick() {
    this.nextClicked.emit();
  }
}
