export class Movie{

  public id: string;
  public title: string;
  public sinapsis: string;
  public image: string;
  public rating: number;
  public genres: string[];

  constructor(id: string, title: string, image: string, sinapsis: string, rating: number = -1, genres: string[] = []){
    this.id = id;
    this.title = title;
    this.image = image;
    this.sinapsis = sinapsis;
    this.rating = rating;
    this.genres = genres;
  }
}
