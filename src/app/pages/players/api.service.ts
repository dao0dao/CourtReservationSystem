import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Player } from './interfaces';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  addPlayer(player: Player): Observable<any> {
    return this.http.post<any>(environment.apiLink + 'players/addPlayer', player);
  }

  getAllPlayers(): Observable<any> {
    return this.http.get<any>(environment.apiLink + 'players');
  }

}
