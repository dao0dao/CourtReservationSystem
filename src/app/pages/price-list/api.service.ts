import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PriceList } from './interfaces';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  getPriceList(): Observable<PriceList[]> {
    return this.http.get<PriceList[]>(environment.apiLink + 'price/list');
  }

  cretePriceList(priceList: PriceList): Observable<{ status: number, id: string; }> {
    return this.http.post<{ status: number, id: string; }>(environment.apiLink + 'price/list', priceList);
  }

  editPriceList(priceList: PriceList): Observable<{ status: number; }> {
    return this.http.put<{ status: number; }>(environment.apiLink + 'price/list', priceList);
  }

  deletePriceList(id: string): Observable<{ status: number; }> {
    return this.http.delete<{ status: number; }>(environment.apiLink + 'price/list/' + id);
  }

}
