export class MovieDescriptor{

  public filmId: string;
  public title: string;
  public rating: number;
  public image: string;

  constructor(filmId: string, name: string, rating: number, source: string){
    this.filmId = filmId;
    this.title = name;
    this.rating = rating;
    this.image = source;
  }
}
