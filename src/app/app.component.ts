import { Component } from '@angular/core';
import { animations } from './animations';
import { InfoService } from './info.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: animations
})
export class AppComponent {

  constructor(public infoService: InfoService) { }

  isMenu: boolean = false;

  toggleMenu() {
    this.isMenu = !this.isMenu;
  }

}
