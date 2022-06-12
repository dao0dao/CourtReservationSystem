import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PriceList } from '../price-list/interfaces';
import { Player, PlayerSql } from './interfaces';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  addPlayer(player: PlayerSql): Observable<any> {
    return this.http.post<any>(environment.apiLink + 'players/addPlayer', player);
  }

  getAllPlayers(): Observable<any> {
    return this.http.get<any>(environment.apiLink + 'players');
  }

  updatePlayer(player: PlayerSql): Observable<any> {
    return this.http.post<any>(environment.apiLink + 'players/editPlayer', player);
  }

  deletePlayer(playerId: string): Observable<any> {
    return this.http.delete<any>(environment.apiLink + 'players/deletePlayer/' + playerId);
  }

  getPriceList(): Observable<PriceList[]> {
    return this.http.get<PriceList[]>(environment.apiLink + 'price/list');
  }

}
