import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';
import { animations } from './animations';
import { InfoService } from './info.service';
import { LoginStateService } from './pages/login-state.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: animations
})
export class AppComponent {

  constructor(public infoService: InfoService, private http: HttpClient, public loginState: LoginStateService) { }

  isMenu: boolean = false;

  toggleMenu() {
    this.isMenu = !this.isMenu;
  }

  logout() {
    this.http.get(environment.apiLink + 'logout').subscribe({
      next: (res) => {
        this.isMenu = false;
        this.loginState.logOut();
      },
      error: (err) => {
        this.isMenu = false;
        this.loginState.logOut();
      }
    });
  }

}
