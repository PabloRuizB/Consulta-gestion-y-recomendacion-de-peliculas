import { Component, EventEmitter, Input, Output} from "@angular/core";

const MAX_RATING = 5;

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.scss']
})
export class RatingComponent{

  @Output() rated : EventEmitter<number> = new EventEmitter<number>();

  private _rating: number;
  @Input() set rating(value: number) {
    if(value > 0 && value != this._rating)
      this.rated.emit(value);
    this._rating = value;
    this.provisional_rating = this._rating;
  }
  public get rating(): number {
    return this._rating;
  }

  public provisional_rating = 0;

  ngOnInit(){
    this.provisional_rating = this.rating;
  }


}
