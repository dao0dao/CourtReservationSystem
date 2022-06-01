import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { LoginStateService } from '../login-state.service';
import { ApiService } from './api.service';
import { ModalAction, PriceList } from './interfaces';


@Component({
  selector: 'app-price-list',
  templateUrl: './price-list.component.html',
  styleUrls: ['./price-list.component.scss']
})
export class PriceListComponent implements OnInit {

  environment = environment;

  priceList: PriceList[] = [];

  page: number = 1;
  itemsPerPage: number = 10;
  pageCount: number = 1;

  isEditModal: boolean = false;
  editedPriceList: PriceList | undefined;
  modalAction: ModalAction | undefined;

  isDeleteModal: boolean = false;
  deletedPriceList: PriceList | undefined;

  constructor(
    public stateService: LoginStateService,
    private api: ApiService
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

  openEditModal(action: ModalAction, editedId?: string) {
    this.editedPriceList = this.priceList.find(el => el.id === editedId);
    this.isEditModal = true;
    this.modalAction = action;
  }

  closeEditModal(event: boolean) {
    if (event) {
      this.isEditModal = false;
      this.editedPriceList = undefined;
    }
  }

  createList(event: PriceList) {
    if (this.modalAction === 'new') {
      this.api.cretePriceList(event).subscribe({
        next: (res) => {
          if (res.status === 201) {
            event.id = res.id;
            this.priceList.push(event);
            this.isEditModal = false;
            return;
          }
        },
        error: () => {
          this.isEditModal = false;
          return;
        }
      });
    }
    if (this.modalAction === 'edit') {
      this.api.editPriceList(event).subscribe({
        next: (res) => {
          if (res.status === 202) {
            this.priceList.forEach(pl => pl.id === event.id ? pl = event : null);
            this.isEditModal = false;
            return;
          }
        },
        error: () => {
          this.isEditModal = false;
          return;
        }
      });
    }
  }

  openDeleteModal(priceList: PriceList) {
    this.deletedPriceList = priceList;
    this.isDeleteModal = true;
  }

  hideDeleteModal() {
    this.isDeleteModal = false;
    this.deletedPriceList = undefined;
  }

  closeDeleteModal(isConfirm: boolean) {
    if (isConfirm) {
      this.api.deletePriceList(this.deletedPriceList?.id!).subscribe({
        next: (res) => {
          this.hideDeleteModal();
        },
        error: () => {
          this.hideDeleteModal();
        }
      });
    } else {
      this.hideDeleteModal();
    }
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
