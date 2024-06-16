import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CategoryService } from 'src/app/Core/Service/category.service';

import SwiperCore , {
  Navigation,
  Pagination,
  Scrollbar,
  Virtual,
  Autoplay,
} from 'swiper';

SwiperCore.use([
  Navigation,
  Pagination,
  Scrollbar,
  Virtual,
  Autoplay,
]);



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  
  constructor() { }

  ngOnInit(): void {
    

  }

}
