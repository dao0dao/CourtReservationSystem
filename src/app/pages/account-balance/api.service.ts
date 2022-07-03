import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiService as PlayerService } from '../players/api.service';
import { Player } from '../players/interfaces';
import { BalancePayment } from './interfaces';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient, private playerService: PlayerService) { }

  getAllPlayers(): Observable<Player[]> {
    return this.playerService.getAllPlayers();
  }

  payForService(data: BalancePayment): Observable<{ updated: true; }> {
    return this.http.post<{ updated: true; }>(environment.apiLink + 'price/balance/payment', data);
  }

}
