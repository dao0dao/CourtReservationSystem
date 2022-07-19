import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Player } from '../players/interfaces';
import { Reservation, ReservationPayment, ReservationSQL, UpdateReservationSQL } from './interfaces';
import { ApiService as PriceListApi } from '../../pages/price-list/api.service';
import { PriceList } from '../price-list/interfaces';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient, private priceListApi: PriceListApi) { }

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

  deleteReservation(id: string): Observable<any> {
    return this.http.delete(environment.apiLink + 'reservation/' + id);
  }

  getAllPriceLists(): Observable<PriceList[]> {
    return this.priceListApi.getPriceList();
  }

  payForReservation(data: ReservationPayment): Observable<{ updated: boolean; }> {
    return this.http.put<{ updated: boolean; }>(environment.apiLink + 'reservation/payment', data);
  }

}
