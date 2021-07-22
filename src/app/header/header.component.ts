import { Component, OnInit } from '@angular/core';
import{ GlobalConstants } from '../constants/global-constants';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  //templateUrl:GlobalConstants.ismobile? './header.component.mobile.html':'./header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
