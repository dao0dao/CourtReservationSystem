import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiService as PlayerService } from '../players/api.service';
import { Player } from '../players/interfaces';
import { Balance, BalancePayment, Timestamp } from './interfaces';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient, private playerService: PlayerService) { }

  getAllPlayers(): Observable<Player[]> {
    return this.playerService.getAllPlayers();
  }

  getPlayerBalance(playerId: string): Observable<{ balance: number; }> {
    return this.http.get<{ balance: number; }>(environment.apiLink + 'price/balance/account', { params: { playerId } });
  }

  getPlayerHistory(playerId: string, timestamp: Timestamp): Observable<Balance[]> {
    const { dateFrom, dateTo } = timestamp;
    return this.http.get<Balance[]>(environment.apiLink + 'price/balance/history', { params: { playerId, dateFrom, dateTo } });
  }

  payForService(data: BalancePayment): Observable<{ updated: true; }> {
    return this.http.post<{ updated: true; }>(environment.apiLink + 'price/balance/payment', data);
  }

}
