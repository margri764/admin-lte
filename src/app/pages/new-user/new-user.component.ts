import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import 'bootstrap-switch';


@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.css']
})
export class NewUserComponent implements OnInit {


  
    constructor() { }
  
    ngOnInit(): void {
  
      $("input[data-bootstrap-switch]").each(function() {
        $(this).bootstrapSwitch('state',  $(this).prop('checked'));
      });
      $("input[data-bootstrap-switch]").each(function() {
        $(this).bootstrapSwitch('data-on-text', 'NuevoTexto');
      });
    
  
   
    }
  
  }