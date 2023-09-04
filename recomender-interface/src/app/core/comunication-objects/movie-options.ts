export class MovieOptions {

  constructor (
    public page_size: number,
    public page_number: number,
    public order: string = "id ASC",
    public filter: string = "",
    public user_id: number = -1,
    ){

  }
}
