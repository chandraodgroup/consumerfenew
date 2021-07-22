import { Component, OnInit, ViewChild} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocationdataService } from '../services/locationdata.service';
import { ListingService } from '../services/listing.service';
import { Router } from '@angular/router';
import {ToastrService} from 'ngx-toastr'

import { NgbDatepickerConfig} from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-home',
 // templateUrl:GlobalConstants.ismobile? './home.component.mobile.html':'./home.component.html',
  templateUrl:'./home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public searchForm: FormGroup;

  public Source: string = 'Source';
  public Destination: string = 'Destination';

  public keyword = 'name';

  position = 'bottom-right';
  

  public source_list:  any = [];
  public destination_list:  any = [];  

  source: any;
  source_id: any;
  destination: any;
  destination_id: any;
  entdate: any;
  
    constructor(private router: Router,private _fb: FormBuilder,
      private locationService: LocationdataService, 
      private listingService : ListingService,
      private toastr: ToastrService ,private dtconfig: NgbDatepickerConfig,
      private spinner: NgxSpinnerService) {

        localStorage.clear();

        const current = new Date();
        this.dtconfig.minDate = { year: current.getFullYear(), month: 
         current.getMonth() + 1, day: current.getDate() };

      
      this.searchForm = _fb.group({
        source: [{value: '', disabled: false}, Validators.required],
        destination: [{value: '', disabled: false}, Validators.required],
        entry_date: [{value: '', disabled: false}, Validators.required],
      });
  
    }

    getSource(val: string){      

      if(val.length == 0){
        this.source_list=[];
      }
  
      if(val.length >= 3){
        this.locationService.all(val).subscribe(
          res=>{

            if(res.status==1)
            { 
              this.source_list =res.data;
           }
            else{ 
              this.toastr.error(res.message, 'Error', {
                timeOut: 4000,
                positionClass: 'toast-bottom-right'
              });
            }

              
          });
      } 
    }

    selectSource(item:any) {
      this.source_id =  item.id;
    }


    getDestination(val: string){

      if(val.length == 0){
        this.destination_list=[];
      }
  
      if(val.length >= 3){
        this.locationService.all(val).subscribe(
          res=>{
            if(res.status==1)
            { 
              this.destination_list =res.data;
            }
            else{ 
              this.toastr.error(res.message, 'Error', {
                timeOut: 4000,
                positionClass: 'toast-bottom-right'
              });
            }

          });
      } 
    }

    selectDestination(item:any) {
      this.destination_id =  item.id;
    }
     
  ngOnInit() {

    this.searchForm = this._fb.group({
      source: [null],
      destination: [null],
      entry_date: [null]
    });


    this.spinner.show();

    setTimeout(() => {
      this.spinner.hide();
    }, 1000);


  }
  
  submitForm() {  
    if (this.searchForm.valid) {

      let dt = this.searchForm.value.entry_date;

      if(dt.month < 10){
        dt.month = "0"+dt.month;
      }
      if(dt.day < 10){
        dt.day = "0"+dt.day;
      }

      this.searchForm.value.entry_date= [dt.day,dt.month,dt.year].join("-");

       let c = this.searchForm.value.source.name;
       let d = this.searchForm.value.destination.name;
       let dat = this.searchForm.value.entry_date;

      this.locationService.setSource(c);
      this.locationService.setSourceID(this.source_id);
      this.locationService.setDestination(d);
      this.locationService.setDestinationID(this.destination_id);
      this.locationService.setDate(dat);
    
      this.router.navigate(['/search']);
    }else{

      
       if(this.searchForm.value.source==null || this.searchForm.value.source==''){

        this.toastr.error("Enter Source !", 'Error', {
           timeOut: 4000,
           positionClass: 'toast-bottom-right'
        });

      }

      else if(this.searchForm.value.destination==null || this.searchForm.value.destination==""){

        this.toastr.error("Enter Destination !", 'Error', {
          timeOut: 4000,
           positionClass: 'toast-bottom-right'
        });

      }

      else if(this.searchForm.value.entry_date==null || this.searchForm.value.entry_date==""){

        this.toastr.error("Enter Journey Date !", 'Error', {
          timeOut: 4000,
          positionClass: 'toast-bottom-right'
        });

      }

     

    }
  }

}
function setSource(s: any, any: any) {
  throw new Error('Function not implemented.');
}

function s(s: any, any: any) {
  throw new Error('Function not implemented.');
}


