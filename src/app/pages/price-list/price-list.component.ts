import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { LoginStateService } from '../login-state.service';
import { ModalAction, PriceList } from './interfaces';


@Component({
  selector: 'app-price-list',
  templateUrl: './price-list.component.html',
  styleUrls: ['./price-list.component.scss']
})
export class PriceListComponent implements OnInit {

  environment = environment;

  priceList: any[] = [];

  page: number = 1;
  itemsPerPage: number = 10;
  pageCount: number = 1;

  isModal: boolean = false;
  modalAction: ModalAction | undefined;

  constructor(
    public stateService: LoginStateService
  ) { }

  ngOnInit(): void {
    this.pageCount = Math.ceil(this.priceList.length / this.itemsPerPage);
    if (this.page > this.pageCount) {
      this.page = this.pageCount;
    }
    if (this.page < 1) {
      this.page = 1;
    }
  }

  openModal(action: ModalAction) {
    this.isModal = true;
    this.modalAction = action;
  }

  closeModal(event: boolean) {
    if (event) { this.isModal = false; }
  }

  createList(event: PriceList) {
    console.log(event);
    this.isModal = false;
  }

  nextPage() {
    if (this.page < this.pageCount) {
      this.page++;
    }
  }

  prevPage() {
    if (this.page > 1) {
      this.page--;
    }
  }

}
