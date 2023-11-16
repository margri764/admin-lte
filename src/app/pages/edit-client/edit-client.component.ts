import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import 'bootstrap-switch';

@Component({
  selector: 'app-edit-client',
  templateUrl: './edit-client.component.html',
  styleUrls: ['./edit-client.component.css']
})
export class EditClientComponent implements OnInit {

  success: string = "green";
  onText : string = "Ative";
  
    constructor() { }
  
    ngOnInit(): void {
  
      $("input[data-bootstrap-switch]").each(function() {
        $(this).bootstrapSwitch('state',  $(this).prop('checked'));
      });
  
    
  
   
    }
  
  }
  