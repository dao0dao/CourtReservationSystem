import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from './interfaces';



@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  getUser(): Observable<User> {
    return this.http.get<User>(environment.apiLink + 'user');
  }

  getListOfUsers(): Observable<{ users: User[]; }> {
    return this.http.get<any>(environment.apiLink + 'user/list');
  }

  updateLoginUser(body: User): Observable<any> {
    return this.http.post(environment.apiLink + 'user', body);
  }

  createUser(body: User): Observable<any> {
    return this.http.post(environment.apiLink + 'user/create', body);
  }

  updateUser(body: User): Observable<any> {
    return this.http.post(environment.apiLink + 'user/list/update', body);
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete(environment.apiLink + 'user/delete/' + id);
  };

}
