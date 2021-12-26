import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree, CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class IsLoginGuard implements CanActivate {

  private isLogin: boolean = false;

  constructor(private http: HttpClient, private router: Router) { };

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (!this.isLogin) {
      this.http.get(environment.apiLink + 'isLogin').subscribe({
        next: (res: any) => {
          this.isLogin = res.isLogin;
          return true;
        },
        error: (err) => {
          this.router.navigate(['/login']);
          return false;
        }
      });
    }
    return true;
  }

  logOut() {
    this.isLogin = false;
    this.router.navigate(['/login']);
  }

}
