import { Component, forwardRef, OnInit} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR, FormBuilder, FormGroup, FormArray, FormControl, Validators, AbstractControl} from '@angular/forms';
import {NgbNavConfig} from '@ng-bootstrap/ng-bootstrap';
import { LocationdataService } from '../services/locationdata.service';
import { ListingService } from '../services/listing.service';
import { FilterOptionsService } from '../services/filter-options.service';
import { SeatLayoutService } from '../services/seat-layout.service';
import { FilterService } from '../services/filter.service';
import { GetSeatPriceService } from '../services/get-seat-price.service';
import { BoardingDropingPointService } from '../services/boarding-droping-point.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SeatsLayout } from '../model/seatslayout';
import { Buslist } from '../model/buslist';
import { DomSanitizer,SafeResourceUrl } from '@angular/platform-browser';
import {ToastrService} from 'ngx-toastr'
import { ItemsList } from '@ng-select/ng-select/lib/items-list';
import { NgbDatepickerConfig} from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { NgxSpinnerService } from "ngx-spinner";

export const DATEPICKER_VALUE_ACCESSOR =  {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => SearchComponent),
  multi: true
};

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
  providers: [DatePipe]
})



export class SearchComponent  implements ControlValueAccessor {  

  selectedDate: any;
  disabled = false;

  // Function to call when the date changes.
  onChange = (date?: Date) => {};

  // Function to call when the date picker is touched
  onTouched = () => {};

  writeValue(value: Date) {
    if (!value) return;
    this.selectedDate = {
      year: value.getFullYear(),
      month: value.getMonth(),
      day: value.getDate()
    }
  }

  registerOnChange(fn: (date: Date) => void): void {
    this.onChange = fn;
  }

  // Allows Angular to register a function to call when the input has been touched.
  // Save the function as a property to call later here.
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  // Allows Angular to disable the input.
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  // Write change back to parent
  onDateChange(value: Date) {
    this.onChange(value);
  }

  // Write change back to parent
  onDateSelect(value: any) {
    this.onChange(new Date(value.year, value.month - 1, value.day));
  }


  source :any;
  destination :any;
  source_id :any;
  destination_id :any;
  entdate :any;
  jrnyDt:any;
  buslist :Buslist[] =[];
  buslistRecord :Buslist;

  busId: any;
  seatsLayouts :  SeatsLayout[];
  seatsLayoutRecord :  SeatsLayout;  

  public filterForm: FormGroup;

  keyword = 'name'  
  public searchForm: FormGroup;
  public seatForm: FormGroup ;

  public Source: string = 'Source';
  public Destination: string = 'Destination';
  public source_list:  any = [];
  public destination_list:  any = []; 

  busTypes :any=[];
  seatTypes :any=[];
  boardingPoints :any=[];
  droppingPoints :any=[];
  busOperators :any=[];
  amenities :any=[];

  LowerberthArr: any=[];
  UpperberthArr: any=[];

  boardingPointArr:any=[];
  droppingPointArr:any=[];
  


  Lowerberth: any;
  Upperberth: any;
 
  constructor(private route: ActivatedRoute,private router: Router,private fb : FormBuilder , config: NgbNavConfig,private locationService: LocationdataService,
     private listingService : ListingService, 
     private filterOptionsService : FilterOptionsService,
     private sanitizer: DomSanitizer, private filterService :FilterService,
     private seatLayoutService: SeatLayoutService,
     private getSeatPriceService:GetSeatPriceService,
     private boardingDropingPointService:BoardingDropingPointService,
     private toastr: ToastrService,
     private dtconfig:NgbDatepickerConfig,
     private datePipe: DatePipe,
     private spinner: NgxSpinnerService
     ) { 

      this.spinner.hide();     


      const current = new Date();
        dtconfig.minDate = { year: current.getFullYear(), month: 
         current.getMonth() + 1, day: current.getDate() };


      this.buslistRecord = {} as Buslist;

    this.seatsLayouts=[];
    this.seatsLayoutRecord={} as SeatsLayout;
    
    config.destroyOnHide = false;
    config.roles = false;

    this.searchForm = this.fb.group({
      source: [null, Validators.compose([Validators.required])],
      destination: [null, Validators.compose([Validators.required])],
      entry_date: [null, Validators.compose([Validators.required])],
    });
   
    this.filterForm = this.fb.group({
      price: [0],
      busType: this.fb.array([]),
      seatType: this.fb.array([]),
      boardingPointId: this.fb.array([]),
      dropingingPointId: this.fb.array([]),
      operatorId: this.fb.array([]),
      amenityId: this.fb.array([]),
    })

    this.seatForm = this.fb.group({
      boardingPoint: [null, Validators.compose([Validators.required])],
      droppingPoint: [null, Validators.compose([Validators.required])],
      Lowerberth:this.fb.array([]),   
      Upperberth:this.fb.array([])   
    });    
  }


  submitSeat(){
      if (this.seatForm.valid) {
      const bookingdata={

        LowerBerthSeats:this.selectedLB,
        Lowerberth:this.seatForm.value.Lowerberth,
        UpperBerthSeats:this.selectedUB,
        Upperberth:this.seatForm.value.Upperberth,
        boardingPoint:this.seatForm.value.boardingPoint,
        busId:this.busId,
        TotalPrice:this.TotalPrice,
        droppingPoint:this.seatForm.value.droppingPoint
      }
      localStorage.setItem('bookingdata',JSON.stringify(bookingdata));
      localStorage.setItem('busRecord',JSON.stringify(this.buslistRecord));
      this.router.navigate(['booking']);     
    }else{

      if(this.seatForm.value.boardingPoint==null || this.searchForm.value.boardingPoint==''){

        this.toastr.error("Select Boarding Point !", 'Error', {
          timeOut: 4000,
           positionClass: 'toast-bottom-right'
        });

      }

      else if(this.seatForm.value.droppingPoint==null || this.searchForm.value.droppingPoint==''){

        this.toastr.error("Select Dropping Point !", 'Error', {
          timeOut: 4000,
           positionClass: 'toast-bottom-right'
        });

      }

      else if(this.seatForm.value.Lowerberth==null || this.searchForm.value.Lowerberth=='' || this.seatForm.value.Upperberth==null || this.searchForm.value.Upperberth==''){

        this.toastr.error("Select Seat !", 'Error', {
          timeOut: 4000,
           positionClass: 'toast-bottom-right'
        });

      }


    }
  }

  updateUpperberth(e:any){
    const Upperberth: FormArray = this.seatForm.get('Upperberth') as FormArray;  
    if (e.target.checked) {
      Upperberth.push(new FormControl(e.target.value));
    } else {
      let i: number = 0;
      Upperberth.controls.forEach((item: AbstractControl) => {
        if (item.value == e.target.value) {
          Upperberth.removeAt(i);
          return;
        }
        i++;
      });
    }

    this.getPriceOnSeatSelect();

  }

  updateLowerberth(e:any){
    const Lowerberth: FormArray = this.seatForm.get('Lowerberth') as FormArray;  
    if (e.target.checked) {
      Lowerberth.push(new FormControl(e.target.value));
    } else {
      let i: number = 0;
      Lowerberth.controls.forEach((item: AbstractControl) => {
        if (item.value == e.target.value) {
          Lowerberth.removeAt(i);
          return;
        }
        i++;
      });
    }

    this.getPriceOnSeatSelect();
  }

  selectedLB:any=[];
  selectedUB:any=[];
  TotalPrice:any;
  
  getPriceOnSeatSelect(){

    const SeatPriceParams={
      seater: this.seatForm.value.Lowerberth,
      sleeper: this.seatForm.value.Upperberth,
      destinationId: this.destination_id,
      sourceId: this.source_id,
      busId: this.busId
    }

    let params='';
    let seaterparam='';
    let sleeperparam='';
    
    let lbIds=SeatPriceParams.seater; 
    let ubIds=SeatPriceParams.sleeper; 
   
    this.selectedLB = this.seatsLayoutRecord.lower_berth.filter((itm) =>{

      if(lbIds.indexOf(itm.id.toString()) > -1){
        seaterparam +='&seater[]='+itm.id;
      } 
      return lbIds.indexOf(itm.id.toString()) > -1; 

    }).map(itm => itm.seatText);

    this.selectedUB = this.seatsLayoutRecord.upper_berth.filter((t) =>{  
      if(ubIds.indexOf(t.id.toString()) > -1){
        sleeperparam +='&sleeper[]='+t.id;  
      }
      return ubIds.indexOf(t.id.toString()) > -1; 
    }).map(t => t.seatText);

    if(this.selectedLB.length != 0 || this.selectedUB.length != 0){

      params +='destinationId='+SeatPriceParams.destinationId+'&sourceId='+SeatPriceParams.sourceId+'&busId='+SeatPriceParams.busId
      if(seaterparam){
        params += seaterparam;
      }

      if(sleeperparam){
        params += sleeperparam;
      }
     
      this.getSeatPriceService.getprice(params).subscribe(
        res=>{
          //console.log(res);
          //let dd = JSON.parse(res.data);          
          this.TotalPrice=res.data[0].totalPrice;  
          this.buslistRecord.seaterPrice =res.data[0].seaterPrice; 
          this.buslistRecord.sleeperPrice =res.data[0].sleeperPrice; 
        });

    }else{
      this.TotalPrice=0;
    }
       
  }

  updateBusType(e:any) {
    const busType: FormArray = this.filterForm.get('busType') as FormArray;
  
    if (e.target.checked) {
      busType.push(new FormControl(e.target.value));
    } else {
      let i: number = 0;
      busType.controls.forEach((item: AbstractControl) => {
        if (item.value == e.target.value) {
          busType.removeAt(i);
          return;
        }
        i++;
      });
    }

    this.submitFilterForm();
  }

  updateSeatType(e:any) {
    const seatType: FormArray = this.filterForm.get('seatType') as FormArray;
  
    if (e.target.checked) {
      seatType.push(new FormControl(e.target.value));
    } else {
      let i: number = 0;
      seatType.controls.forEach((item: AbstractControl) => {
        if (item.value == e.target.value) {
          seatType.removeAt(i);
          return;
        }
        i++;
      });
    }

    this.submitFilterForm();
  }

  
  updateBoarding(e : any){
    
    const boardingPointId: FormArray = this.filterForm.get('boardingPointId') as FormArray;
  
    if (e.target.checked) {
      boardingPointId.push(new FormControl(e.target.value));
    } else {
      let i: number = 0;
      boardingPointId.controls.forEach((item: AbstractControl) => {
        if (item.value == e.target.value) {
          boardingPointId.removeAt(i);
          return;
        }
        i++;
      });
    }
    this.submitFilterForm();
  }

  updateDropping(e : any){    
    const dropingingPointId: FormArray = this.filterForm.get('dropingingPointId') as FormArray;
  
    if (e.target.checked) {
      dropingingPointId.push(new FormControl(e.target.value));
    } else {
      let i: number = 0;
      dropingingPointId.controls.forEach((item: AbstractControl) => {
        if (item.value == e.target.value) {
          dropingingPointId.removeAt(i);
          return;
        }
        i++;
      });
    }
    this.submitFilterForm();
  }

  updateOperator(e : any){    
    const operatorId: FormArray = this.filterForm.get('operatorId') as FormArray;
  
    if (e.target.checked) {
      operatorId.push(new FormControl(e.target.value));
    } else {
      let i: number = 0;
      operatorId.controls.forEach((item: AbstractControl) => {
        if (item.value == e.target.value) {
          operatorId.removeAt(i);
          return;
        }
        i++;
      });
    }
    this.submitFilterForm();
  }

  updateAmenity(e : any){  

    const amenityId: FormArray = this.filterForm.get('amenityId') as FormArray;
  
    if (e.target.checked) {
      amenityId.push(new FormControl(e.target.value));
    } else {
      let i: number = 0;
      amenityId.controls.forEach((item: AbstractControl) => {
        if (item.value == e.target.value) {
          amenityId.removeAt(i);
          return;
        }
        i++;
      });
    }

    this.submitFilterForm();

  }

  updatePrice(e: any){

    
    let price = this.filterForm.get('price') as FormControl;

    if (e.target.checked) {
      price.patchValue(e.target.value);
      
    }else{
      price.patchValue(0);
    }

    this.submitFilterForm();

  }

  resetFilterForm(){
    this.filterForm = this.fb.group({
      price: [0], 
      busType: this.fb.array([]),
      seatType: this.fb.array([]),
      boardingPointId: this.fb.array([]),
      dropingingPointId: this.fb.array([]),
      operatorId: this.fb.array([]),
      amenityId: this.fb.array([]),
    });

    this.submitFilterForm();
  }

  submitFilterForm() {
    this.spinner.show();

   let filterparam='';
    let et= this.entdate;

   filterparam ='price='+this.filterForm.value.price+'&sourceID='+this.source_id+
    '&destinationID='+this.destination_id+
    '&entry_date='+et;

   if(this.filterForm.value.busType){

    this.filterForm.value.busType.forEach((e: any) => {

      filterparam +='&busType[]='+e; 
      
    });

   }

   
   if(this.filterForm.value.seatType){

    this.filterForm.value.seatType.forEach((e: any) => {

      filterparam +='&seatType[]='+e; 
      
    });

   }

     
   if(this.filterForm.value.boardingPointId){

    this.filterForm.value.boardingPointId.forEach((e: any) => {

      filterparam +='&boardingPointId[]='+e; 
      
    });

   }

   if(this.filterForm.value.dropingingPointId){

    this.filterForm.value.dropingingPointId.forEach((e: any) => {

      filterparam +='&dropingingPointId[]='+e; 
      
    });

   }

   if(this.filterForm.value.operatorId){

    this.filterForm.value.operatorId.forEach((e: any) => {

      filterparam +='&operatorId[]='+e; 
      
    });

   }

   if(this.filterForm.value.amenityId){

    this.filterForm.value.amenityId.forEach((e: any) => {

      filterparam +='&amenityId[]='+e; 
      
    });

   }   

    this.filterService.getlist(filterparam).subscribe(
      res=>{
         this.buslist = res.data;
         this.totalfound = res.data.length;   

         this.spinner.hide();
      });

 }

  getSource(val: string){
    if(val.length == 0){
      this.source_list=[];
    }
    if(val.length >= 3){     
      this.locationService.all(val).subscribe(
        res=>{
            this.source_list = res.data;
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
            this.destination_list =res.data;
        });
    }
  }

  selectDestination(item:any) {
    this.destination_id =  item.id;
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
      this.source = c;
      this.destination = d;
      this.entdate = this.searchForm.value.entry_date;
      
      this.locationService.setSource(c);
      this.locationService.setDestination(d);
      this.locationService.setSourceID(this.source_id);
      this.locationService.setDestinationID(this.destination_id);
      this.locationService.setDate(this.searchForm.value.entry_date);
      
      this.getbuslist();

      this.isShown = false ; 

      this.showformattedDate(this.searchForm.value.entry_date);

    }
    else{

      
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

  
  totalfound: any = 0 ;

  getbuslist() {
    this.spinner.show();

    this.listingService.getlist(this.source,this.destination,this.entdate).subscribe(
      res=>{
       // console.log(res);
        localStorage.setItem('source', this.source);
        localStorage.setItem('source_id', this.source_id);
        localStorage.setItem('destination', this.destination);
        localStorage.setItem('destination_id', this.destination_id);
        localStorage.setItem('entdate', this.entdate);  
        this.buslist = res.data;
        this.totalfound = res.data.length;  

        this.spinner.hide();
      });

  }

  colarr:any[]=[];

  getseatlayout(){

    let bus_id=this.busId;

    if(this.seatsLayouts[bus_id]){  
      this.seatsLayoutRecord= this.seatsLayouts[bus_id];    
      this.createberth();         
      //this.createUpperberth();  
    }
    else{
      
     
      this.seatLayoutService.getSeats(bus_id).subscribe(
        res=>{ 
               
          this.seatsLayouts[bus_id]= res.data;   
          this.seatsLayoutRecord= res.data; 
          this.createberth(); 

        }); 
    }

  }

  createberth(){

    let upper_berth = this.seatsLayoutRecord.upper_berth;
    let row = this.seatsLayoutRecord.upperBerth_totalRows;
    let col = this.seatsLayoutRecord.upperBerth_totalColumns;

   
    if(upper_berth.length){

      for(let i=0; i < row;i++){  
        this.colarr=[];         
        for(let k=0; k < col;k++){
          upper_berth.forEach((a) => {  
            if(a.rowNumber== i && a.colNumber== k){
              this.colarr.push(a);
            }
          });               
        }
        this.UpperberthArr[i]=this.colarr;     
      }

    }

    


    let row2 = this.seatsLayoutRecord.lowerBerth_totalRows;
    let col2 = this.seatsLayoutRecord.lowerBerth_totalColumns;
    let lower_berth = this.seatsLayoutRecord.lower_berth; 
    
    
    if(lower_berth.length){

    for(let i=0; i < row2;i++){  
      this.colarr=[];         
      for(let k=0; k < col2;k++){
        lower_berth.forEach((a) => {  
          if(a.rowNumber== i && a.colNumber== k){
            this.colarr.push(a);
          }
        });               
      }

      this.LowerberthArr[i]=this.colarr;
     
    } 
  }

  }

  getBoardingDroppingPoints(){

    let bus_id=this.busId;

    this.boardingDropingPointService.getdata(bus_id,this.source_id,this.destination_id).subscribe(
      res=>{
       this.boardingPointArr=res.data[0].boardingPoints;
       this.droppingPointArr=res.data[0].droppingPoints;
      }); 
    
  }

  ShowLayout(id :any) {

    this.seatForm.reset();

    this.buslistRecord =this.buslist[id];

    let currentBusId=this.buslist[id].busId;

    this.busId=this.buslistRecord.busId;
    this.LowerberthArr=[];
    this.UpperberthArr=[];
    this.TotalPrice=0;
    this.droppingPointArr=[];
    this.boardingPointArr=[];
    this.selectedLB=[];
    this.selectedUB=[];

    if(currentBusId == this.busId){
    }else{

      this.seatForm = this.fb.group({
        boardingPoint: [null, Validators.compose([Validators.required])],
        droppingPoint: [null, Validators.compose([Validators.required])],
        Lowerberth:this.fb.array([]),   
        Upperberth:this.fb.array([])   
      });

     

      this.buslist.forEach((v, index) => {
        if(index != id) {
          // $('#seatlayout'+index).hide();
          // $('#showrow'+index).show();
          // $('#hiderow'+index).hide();
        }
      });
      
    }

    this.getseatlayout();
    this.getBoardingDroppingPoints();

    // $('#seatlayout'+id).show();
    // $('#showrow'+id).hide();
    // $('#hiderow'+id).show();
    // $('#safety'+id).hide();
    // $('#bus_pic'+id).hide();
    // $('#review'+id).hide();
    // $('#booking_policy'+id).hide(); 
    
  }

  
  HideLayout(id: any) {
    // $('#seatlayout'+id).hide();
    // $('#showrow'+id).show();
    // $('#hiderow'+id).hide();
    // $('#safety'+id).hide();
    // $('#bus_pic'+id).hide();
    // $('#review'+id).hide();
    // $('#booking_policy'+id).hide();    
  }
  
  safety(id:any){
    // $('#safety'+id).show();
    // $('#seatlayout'+id).hide();
    // $('#showrow'+id).show();
    // $('#hiderow'+id).hide();
    // $('#bus_pic'+id).hide();
    // $('#review'+id).hide();
    // $('#booking_policy'+id).hide();
  }

  bus_pic(id:any){

    // $('#bus_pic'+id).show();
    // $('#seatlayout'+id).hide();
    // $('#showrow'+id).show();
    // $('#safety'+id).hide();
    // $('#hiderow'+id).hide();
    // $('#review'+id).hide();
    // $('#booking_policy'+id).hide();

  }

  reviews(id:any){

    // $('#review'+id).show();
    // $('#seatlayout'+id).hide();
    // $('#showrow'+id).show();
    // $('#safety'+id).hide();
    // $('#hiderow'+id).hide();
    // $('#bus_pic'+id).hide();
    // $('#booking_policy'+id).hide();

  }


  booking_policy(id:any){
    
    // $('#booking_policy'+id).show();
    // $('#review'+id).hide();
    // $('#seatlayout'+id).hide();
    // $('#showrow'+id).show();
    // $('#safety1'+id).hide();
    // $('#hiderow'+id).hide();
    // $('#bus_pic'+id).hide();

  }

  getImagePath(icon :any){
   // let objectURL = 'data:image/jpeg;base64,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'
    ;

     let objectURL = 'data:image/jpeg;base64,'+icon  ;
    return this.sanitizer.bypassSecurityTrustResourceUrl(objectURL);
  }

  


  filteroptions(){

    this.spinner.show();

    this.filterOptionsService.getoptions(this.source_id,this.destination_id).subscribe(
      res=>{ 
        this.busTypes = res.data[0].busTypes;        
        this.seatTypes = res.data[0].seatTypes;        
        this.boardingPoints = res.data[0].boardingPoints;  
        this.droppingPoints = res.data[0].dropingPoints;  
        this.busOperators = res.data[0].busOperator;  
        this.amenities = res.data[0].amenities;

        this.spinner.hide();

      });      

  }

  isShown: boolean = false ; // hidden by default


  toggleShow() {

    this.isShown = ! this.isShown;
    
  }

  showformattedDate(date:any){
    let dt = date.split("-");
    let dd=new Date(dt[1]+'-'+dt[0]+'-'+dt[2]);
    this.jrnyDt = {
      year: dd.getFullYear(),
      month: dd.getMonth(),
      day: dd.getDate()
    }
  

  }

  ngOnInit() :void{ 

    this.locationService.currentsource.subscribe(s => { this.source = s || localStorage.getItem('source'); });
    this.locationService.currentdestination.subscribe(d => { this.destination = d || localStorage.getItem('destination'); });
    this.locationService.currentsource_id.subscribe(s => { this.source_id = s || localStorage.getItem('source_id'); });
    this.locationService.currentdestination_id.subscribe(d => { this.destination_id = d || localStorage.getItem('destination_id'); });
    this.locationService.currententdate.subscribe(dat => { this.entdate = dat || localStorage.getItem('entdate'); });
    

    if((this.source_id=='' || this.source_id==null)  || (this.destination_id=='' || this.destination_id==null ) || (this.entdate=='' || this.entdate==null )){

      this.router.navigate(['/']);

    }

    this.showformattedDate(this.entdate);
    this.getbuslist();
    this.filteroptions();

  

    // $('.srt-by-opert').click(function () {
    //   if ($(this).attr('class') == 'srt-by-opert') {
    //     $(".srt-by-opert").addClass("intro");
    //   } else if ($(this).attr('class') == 'srt-by-opert intro') {
    //     $(".srt-by-opert").removeClass("intro");
    //   }
    // });

    // $('.srt-by-dept').click(function () {
    //   if ($(this).attr('class') == 'srt-by-dept') {
    //     $(".srt-by-dept").addClass("intro");
    //   } else if ($(this).attr('class') == 'srt-by-dept intro') {
    //     $(".srt-by-dept").removeClass("intro");
    //   }
    // });

    // $('.srt-by-duraton').click(function () {
    //   if ($(this).attr('class') == 'srt-by-duraton') {
    //     $(".srt-by-duraton").addClass("intro");
    //   } else if ($(this).attr('class') == 'srt-by-duraton intro') {
    //     $(".srt-by-duraton").removeClass("intro");
    //   }
    // });

    // $('.srt-by-arival').click(function () {
    //   if ($(this).attr('class') == 'srt-by-arival') {
    //     $(".srt-by-arival").addClass("intro");
    //   } else if ($(this).attr('class') == 'srt-by-arival intro') {
    //     $(".srt-by-arival").removeClass("intro");
    //   }
    // });

    // $('.srt-by-seats').click(function () {
    //   if ($(this).attr('class') == 'srt-by-seats') {
    //     $(".srt-by-seats").addClass("intro");
    //   } else if ($(this).attr('class') == 'srt-by-seats intro') {
    //     $(".srt-by-seats").removeClass("intro");
    //   }
    // });

    // $('.srt-by-prc').click(function () {
    //   if ($(this).attr('class') == 'srt-by-prc') {
    //     $(".srt-by-prc").addClass("intro");
    //   } else if ($(this).attr('class') == 'srt-by-prc intro') {
    //     $(".srt-by-prc").removeClass("intro");
    //   }
    // });
  }

}


