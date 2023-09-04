import { ChangeDetectionStrategy, Component, ComponentMirror, EventEmitter, HostListener, Input, Output } from "@angular/core";

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent{

  @Input() searchText: string = "";
  @Output() search : EventEmitter<string> = new EventEmitter<string>();
  @Output() textChanged : EventEmitter<string> = new EventEmitter<string>();

  onSearch(){
    this.search.emit(this.searchText);
  }

  onChange(){
    this.textChanged.emit(this.searchText);
  }
}
