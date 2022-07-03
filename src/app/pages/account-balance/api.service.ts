import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService as PlayerService } from '../players/api.service';
import { Player } from '../players/interfaces';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient, private playerService: PlayerService) { }

  getAllPlayers(): Observable<Player[]> {
    return this.playerService.getAllPlayers();
  }
}
