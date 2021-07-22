import { Component, OnInit } from '@angular/core';
import { NgbModalConfig, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-testimonials',
  templateUrl: './testimonials.component.html',
  styleUrls: ['./testimonials.component.css'],
  providers: [NgbModalConfig, NgbModal]
})
export class TestimonialsComponent implements OnInit {

  modalReference: NgbModalRef | undefined;

  constructor(private modalService: NgbModal) { }

  OpenModal(review : any) {
    this.modalReference=this.modalService.open(review,{ scrollable: true});
  }

  ngOnInit(): void {
  }



}
