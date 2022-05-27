import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-price-list',
  templateUrl: './price-list.component.html',
  styleUrls: ['./price-list.component.scss']
})
export class PriceListComponent implements OnInit {

  environment = environment;

  priceList: any[]=[]

  page: number = 1;
  itemsPerPage: number = 10;
  pageCount: number = 1;



  constructor() { }

  ngOnInit(): void {
    this.pageCount = Math.ceil(this.priceList.length / this.itemsPerPage);
    if (this.page > this.pageCount) {
      this.page = this.pageCount;
    }
    if (this.page < 1) {
      this.page = 1;
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
