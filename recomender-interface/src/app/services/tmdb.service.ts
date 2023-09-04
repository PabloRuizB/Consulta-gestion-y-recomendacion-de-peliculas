import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UrlService } from './url.service';
import { Movie } from '../core/movie';
import { forkJoin } from 'rxjs';
import { MovieCast } from '../core/movie-cast';
import { CastRoleEnum } from '../core/movie-cast-role';

const tmdbId: string  = '67b27c2f4392457d4a2f77660b441127';

@Injectable({
  providedIn: 'root',
})
export class TMDBService {


    constructor(private urls: UrlService, private http: HttpClient) {
    }

    public async getFilmInfo(film: string): Promise<Movie>{
      return new Promise<Movie>(resolver => {
          const url = this.urls.tmdbURL + 'movie/' + film + '?api_key=' + tmdbId +'&language=es-ES';
          this.http.get(url).subscribe((dataResponse: any) => {
            var movie = new Movie(dataResponse.imdb_id, dataResponse.title, dataResponse.poster_path, dataResponse.overview, -1, dataResponse.genres.map(g => g.name));
            resolver(movie);
          });
        });
    }

    public async getFilmsInfo(films: string[]): Promise<Movie[]>{

      return new Promise<Movie[]>(resolver => {
        var data : Movie[] = [];

        const requests = films.map(imdbId => {
          const url = this.urls.tmdbURL + 'find/' + imdbId + '?api_key=' + tmdbId + '&external_source=imdb_id&language=es-ES';
          return this.http.get(url);
        });

        forkJoin(requests).subscribe(dataResponse => {
          dataResponse.forEach((res: any) => {
            if(res.movie_results.length == 1)
              data.push(new Movie(res.movie_results[0].id, res.movie_results[0].original_title, res.movie_results[0].poster_path, res.movie_results[0].overview));
          });
          resolver(data);
        });

      });
    }


    public async getFilmCast(film: string): Promise<MovieCast[]>{
      return new Promise<MovieCast[]>(resolver => {
          const url = this.urls.tmdbURL + 'movie/' + film + '/credits' + '?api_key=' + tmdbId +'&language=es-ES';
          this.http.get(url).subscribe((dataResponse: any) => {
            var cast: MovieCast[] = [];
            for (let index = 0; index < 6; index++) {
              cast.push(new MovieCast(dataResponse.cast[index].name, CastRoleEnum.Actor));
            }
            dataResponse.crew.filter(x => x.department == 'Writing' && x.job == 'Story').forEach(crewMember => {
              cast.push(new MovieCast(crewMember.name, CastRoleEnum.Writting));
            });
            dataResponse.crew.filter(x => x.department == 'Directing').forEach(crewMember => {
              cast.push(new MovieCast(crewMember.name, CastRoleEnum.Director));
            });
            resolver(cast);
          });
        });
    }
}
