import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UrlService } from './url.service';
import { Movie } from '../core/movie';

const imdbId: string  = 'k_e6oji1gr';

@Injectable({
  providedIn: 'root',
})
export class IMDBService {


    constructor(private urls: UrlService, private http: HttpClient) {
    }

    public async getFilmInfo(filmId: string): Promise<any>{
        this.http.get<any>( this.urls.imdbURL + imdbId + '/' + filmId, ).subscribe(data => {
        return {
            filmId: filmId,
            source: data.image,
            name: data.title,
            rating: 0
          };
      });
    }

    public async getFilmsInfo(films: string[]): Promise<Movie[]>{

        var data : Movie[] = [];

        films.forEach(film => {
            this.http.get<any>(this.urls.imdbURL + imdbId + '/' + film, ).subscribe(dataResponse => {
              console.log(this.urls.imdbURL + imdbId + '/' + film);
              data.push(new Movie(film, dataResponse.title, "", dataResponse.image));
            });
          });

        return data;
    }
}
