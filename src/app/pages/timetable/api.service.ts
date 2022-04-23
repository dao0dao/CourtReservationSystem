import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Player } from '../players/interfaces';
import { Reservation, ReservationSQL, UpdateReservationSQL } from './intefaces';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  getAllPlayers(): Observable<Player[]> {
    return this.http.get<Player[]>(environment.apiLink + 'players');
  }

  getAllReservations(date: string): Observable<{ reservations: Reservation[]; }> {
    return this.http.get<{ reservations: Reservation[]; }>(environment.apiLink + 'reservation', { params: { date } });
  }

  addReservation(reservation: ReservationSQL): Observable<{ status: 'added', id: string; }> {
    return this.http.post<{ status: 'added', id: string; }>(environment.apiLink + 'reservation/add', reservation);
  }

  updateReservation(reservation: UpdateReservationSQL): Observable<{ updated: boolean; }> {
    return this.http.put<{ updated: boolean; }>(environment.apiLink + 'reservation', reservation);
  }

}
