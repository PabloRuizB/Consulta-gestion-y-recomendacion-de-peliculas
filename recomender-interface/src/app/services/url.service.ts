import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UrlService {

    imdbURL : string;
    tmdbURL : string;
    apiURL : string;

    constructor() {
        this.imdbURL = environment.imdbURL;
        this.tmdbURL = environment.tmdbURL;
        this.apiURL = environment.apiURL;
     }

}
