import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Player } from '../players/interfaces';
import { Reservation } from './intefaces';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  getAllPlayers(): Observable<Player[]> {
    return this.http.get<Player[]>(environment.apiLink + 'players');
  }

  getAllReservations(): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(environment.apiLink + 'reservation');
  }

  addReservation(reservation: Reservation): Observable<{ status: 'added', id: string; }> {
    return this.http.post<{ status: 'added', id: string; }>(environment.apiLink + 'addReservation', reservation);
  }

}
