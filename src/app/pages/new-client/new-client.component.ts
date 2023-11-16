import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import 'bootstrap-switch';
@Component({
  selector: 'app-new-client',
  templateUrl: './new-client.component.html',
  styleUrls: ['./new-client.component.css']
})
export class NewClientComponent implements OnInit {

  success: string = "green";
  
    constructor() { }
  
    ngOnInit(): void {
  
      $("input[data-bootstrap-switch]").each(function() {
        $(this).bootstrapSwitch('state',  $(this).prop('checked'));
      });
  
    
  
   
    }
  
  }
  