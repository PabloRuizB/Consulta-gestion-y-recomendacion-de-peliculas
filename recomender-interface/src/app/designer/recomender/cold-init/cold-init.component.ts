import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-cold-init',
  templateUrl: './cold-init.component.html',
  styleUrls: ['./cold-init.component.scss']
})
export class ColdInitComponent {

  @Input() movies: string[] = ['238', '278', '155', '680', '637', '429', '9552', '157336', '121', '807', '13', '354912'];

  current_movie_index: number = -1;

  onNext(){
    this.current_movie_index += 1;
  }
}
