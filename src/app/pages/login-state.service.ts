import { Injectable } from "@angular/core";
import { Router } from "@angular/router";

@Injectable({ providedIn: 'root' })

export class LoginStateService {

  constructor(private router: Router) { }

  private isLogin: boolean = false;
  private isAdmin: boolean = false;


  public logIn(isAdmin: boolean) {
    this.isLogin = true;
    this.isAdmin = isAdmin;
  }

  public logOut() {
    this.isLogin = false;
    this.isAdmin = false;
    this.router.navigate(['/login']);
  }

  get state() {
    return {
      isLogin: this.isLogin,
      isAdmin: this.isAdmin
    };
  }

}
