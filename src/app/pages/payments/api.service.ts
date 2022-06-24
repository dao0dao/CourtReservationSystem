import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiService as PlayerService } from '../players/api.service';
import { Player } from '../players/interfaces';
import { Services } from './interfaces';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient, private playerService: PlayerService) { }

  getAllPlayers(): Observable<Player[]> {
    return this.playerService.getAllPlayers();
  }

  getAllServices(): Observable<{ [key: string]: Services; }> {
    return this.http.get<{ [key: string]: Services; }>(environment.apiLink + 'price/services');
  }

  submitList(list: { [key: string]: Services; }) {
    return this.http.patch<{ status: 201, message: 'created/updated'; }>(environment.apiLink + 'price/services', list);
  }

  deleteService(id: string) {
    return this.http.delete(environment.apiLink + 'price/services/' + id);
  }

}
