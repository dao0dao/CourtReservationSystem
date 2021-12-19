import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(private route: Router, private Router: ActivatedRoute) { }

  isMenu: boolean = false;

  toggleMenu() {
    this.isMenu = !this.isMenu;
  }

  ngOnInit(): void {
    console.log(this.Router.snapshot);
    // this.route.navigate([this.route.url]);

  }


}
