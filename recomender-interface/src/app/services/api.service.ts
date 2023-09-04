import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { UrlService } from './url.service';
import { User } from '../core/user';
import { catchError, throwError } from 'rxjs';
import { AuthenticationsService } from './authentication.service';
import { Movie } from '../core/movie';
import { MovieOptions } from '../core/comunication-objects/movie-options';

@Injectable({
  providedIn: 'root',
})
export class APIService {

  get httpOptions(): any {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.authService.getToken()}`,
      })
    }
  };

  loginhttpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    }),
  };

  constructor(
    private urls: UrlService,
    private http: HttpClient,
    private authService: AuthenticationsService
  ) {}

  /**
   * AUTENTICACION Y REGISTRO
   */

  public async loginUser(mail: string, password: string): Promise<User> {
    return new Promise<User>((resolver) => {
      var user: User = new User(mail, password);
      let body = JSON.stringify(<any>user);

      this.http
        .post(this.urls.apiURL + 'login', body, this.loginhttpOptions)
        .pipe(
          catchError((error: HttpErrorResponse) => {
            if (error.status === 400) {
              console.error('Bad Request');
            }
            resolver(null);
            return throwError(error);
          })
        )
        .subscribe((dataResponse: any) => {
          this.authService.setToken(dataResponse.token);
          user = <User>dataResponse.user;
          resolver(user);
        });
    });
  }

  /**
   * Metodo que llama el resolver para obtener la información del usuario
   */
  getUser(): Promise<User> {
    return new Promise<User>((resolver) => {
      this.http
        .get(this.urls.apiURL + 'user', this.loginhttpOptions)
        .pipe(
          catchError((error: HttpErrorResponse) => {
            if (error.status === 400) {
              console.error('Bad Request');
            }
            resolver(null);
            return throwError(error);
          })
        )
        .subscribe((dataResponse: any) => {
          var user: User = <User>dataResponse.user;
          resolver(user);
        });
    });
  }

  public registerUser(user: User): Promise<any> {
    return new Promise<User>((resolver) => {
      let body = JSON.stringify(<any>user);

      this.http
        .post(this.urls.apiURL + 'register', body, this.loginhttpOptions)
        .pipe(
          catchError((error: HttpErrorResponse) => {
            if (error.status === 400) {
              console.error('Bad Request');
            }
            resolver(null);
            return throwError(error);
          })
        )
        .subscribe((dataResponse: any) => {
          resolver(dataResponse);
        });
    });
  }

  /**
   * CATALOGO Y LSITA DE PENDIENTES
   * @param page_number Numero de páginas
   * @param page_size Tamaño de página
   * @param order Orden de las pelicualas
   * @param filter Texto por el que filtra
   * @param user_id Id de usuario (Si se indica el id de usuario devolverá la lista de pendientes)
   * @returns Promise con la lista de peliculas resultado
   */
  public getCatalog(
    page_number: number,
    page_size: number,
    order: string = 'id DESC',
    filter: any = '',
    user_id?: number
  ): Promise<Movie[]> {
    return new Promise<Movie[]>((resolver) => {
      var options: MovieOptions = new MovieOptions(
        page_size,
        page_number,
        order,
        filter,
        user_id
      );
      let body = JSON.stringify(<any>options);

      this.http
        .post(this.urls.apiURL + 'getCatalog', body, this.httpOptions)
        .pipe(
          catchError((error: HttpErrorResponse) => {
            if (error.status === 400) {
              console.error('Bad Request');
            }
            resolver(null);
            return throwError(error);
          })
        )
        .subscribe((dataResponse: any) => {
          var movie_list: Movie[] = [];
          dataResponse.movies.forEach((element) => {
            movie_list.push(
              new Movie(
                element.id,
                element.title,
                element.image,
                element.sinapsis,
                element.rating
              )
            );
          });
          resolver(movie_list);
        });
    });
  }

  public getRecomendations(
    user_id: number
  ): Promise<any> {
    return new Promise<any>((resolver) => {
      var options = {
        user_id: user_id
      };
      let body = JSON.stringify(<any>options);

      this.http
        .post(this.urls.apiURL + 'getRecomendations', body, this.httpOptions)
        .pipe(
          catchError((error: HttpErrorResponse) => {
            if (error.status === 400) {
              console.error('Bad Request');
            }
            resolver(null);
            return throwError(error);
          })
        )
        .subscribe((dataResponse: any) => {
          resolver(dataResponse);
        });
    });
  }

  /**
   * ACCIONES PARA LA LISTA DE PENDIENTES
   */

  public addMovieToPendingUser(user_id: number, movie_id: string) {
    return new Promise<boolean>((resolver) => {
      var options = {
        user_id: user_id,
        movie_id: movie_id,
      };
      let body = JSON.stringify(<any>options);
      this.http
        .post(this.urls.apiURL + 'addPendingMovie', body, this.httpOptions)
        .pipe(
          catchError((error: HttpErrorResponse) => {
            if (error.status === 400) {
              console.error('Bad Request');
            }
            resolver(false);
            return throwError(error);
          })
        )
        .subscribe((dataResponse: any) => {
          resolver(true);
        });
    });
  }

  public removeMovieFromPendingUser(user_id: number, movie_id: string) {
    return new Promise<boolean>((resolver) => {
      var options = {
        user_id: user_id,
        movie_id: movie_id,
      };
      let body = JSON.stringify(<any>options);
      this.http
        .post(this.urls.apiURL + 'removePendingMovie', body, this.httpOptions)
        .pipe(
          catchError((error: HttpErrorResponse) => {
            if (error.status === 400) {
              console.error('Bad Request');
            }
            resolver(false);
            return throwError(error);
          })
        )
        .subscribe((dataResponse: any) => {
          resolver(true);
        });
    });
  }

  public setUserGravatar(user_id: number, gravatar_id: string) {
    return new Promise<void>((resolver) => {
      var options = {
        user_id: user_id,
        gravatar_id: gravatar_id,
      };
      let body = JSON.stringify(<any>options);
      this.http
        .post(this.urls.apiURL + 'setUserGravatar', body, this.httpOptions)
        .pipe(
          catchError((error: HttpErrorResponse) => {
            if (error.status === 400) {
              console.error('Bad Request');
            }
            resolver();
            return throwError(error);
          })
        )
        .subscribe((dataResponse: any) => {
          resolver();
        });
    });
  }

  public getUserPendingMovies(user_id: number): Promise<Movie[]> {
    return new Promise<Movie[]>((resolver) => {
      this.http
        .get(
          this.urls.apiURL + 'getUserPendingMovies/' + user_id,
          this.httpOptions
        )
        .pipe(
          catchError((error: HttpErrorResponse) => {
            if (error.status === 400) {
              console.error('Bad Request');
            }
            resolver(null);
            return throwError(error);
          })
        )
        .subscribe((dataResponse: any) => {
          var movie_list: Movie[] = [];
          dataResponse.movies.forEach((element) => {
            movie_list.push(
              new Movie(
                element.id,
                element.title,
                element.image,
                element.sinapsis,
                element.rating
              )
            );
          });
          resolver(movie_list);
        });
    });
  }

  public isPendingMovie(user_id: number, movie_id: string): Promise<boolean> {
    return new Promise<boolean>((resolver) => {
      var options = {
        user_id: user_id,
        movie_id: movie_id,
      };

      let body = JSON.stringify(<any>options);
      this.http
        .post(this.urls.apiURL + 'isPendingMovie/', body, this.httpOptions)
        .pipe(
          catchError((error: HttpErrorResponse) => {
            if (error.status === 400) {
              console.error('Bad Request');
            }
            resolver(false);
            return throwError(error);
          })
        )
        .subscribe((dataResponse: any) => {
          resolver(dataResponse.return_value);
        });
    });
  }


  /**
   * RATINGS
   */

  public getUserRatings(
    page_number: number,
    page_size: number,
    order: string = 'id DESC',
    filter: any = '',
    user_id: number
  ): Promise<Movie[]> {
    return new Promise<Movie[]>((resolver) => {
      var options: MovieOptions = new MovieOptions(
        page_size,
        page_number,
        order,
        filter,
        user_id
      );
      let body = JSON.stringify(<any>options);

      this.http
        .post(this.urls.apiURL + 'getRatings', body, this.httpOptions)
        .pipe(
          catchError((error: HttpErrorResponse) => {
            if (error.status === 400) {
              console.error('Bad Request');
            }
            resolver(null);
            return throwError(error);
          })
        )
        .subscribe((dataResponse: any) => {
          var movie_list: Movie[] = [];
          dataResponse.movies.forEach((element) => {
            movie_list.push(
              new Movie(
                element.id,
                element.title,
                element.image,
                element.sinapsis,
                element.rating
              )
            );
          });
          resolver(movie_list);
        });
    });
  }

  public addRating(user_id: number, movie_id: string, rating: number) {
    return new Promise<boolean>((resolver) => {
      var options = {
        user_id: user_id,
        movie_id: movie_id,
        rating: rating,
      };
      let body = JSON.stringify(<any>options);
      this.http
        .post(this.urls.apiURL + 'rateMovie', body, this.httpOptions)
        .pipe(
          catchError((error: HttpErrorResponse) => {
            if (error.status === 400) {
              console.error('Bad Request');
            }
            resolver(false);
            return throwError(error);
          })
        )
        .subscribe((dataResponse: any) => {
          resolver(true);
        });
    });
  }

  public movieRating(user_id: number, movie_id: string): Promise<number> {
    return new Promise<number>((resolver) => {
      var options = {
        user_id: user_id,
        movie_id: movie_id,
      };
      let body = JSON.stringify(<any>options);
      this.http
        .post(this.urls.apiURL + 'movieRating', body, this.httpOptions)
        .pipe(
          catchError((error: HttpErrorResponse) => {
            if (error.status === 400) {
              console.error('Bad Request');
            }
            resolver(-1);
            return throwError(error);
          })
        )
        .subscribe((dataResponse: any) => {
          resolver(dataResponse.rating);
        });
    });
  }

}
