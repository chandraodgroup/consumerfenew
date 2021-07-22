import { Component, OnInit } from '@angular/core';
import{ GlobalConstants } from '../constants/global-constants';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
//  templateUrl:GlobalConstants.ismobile? './footer.component.mobile.html':'./footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
