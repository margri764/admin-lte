import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import 'bootstrap-switch';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {

success: string = "green";
onText : string = "Ative";

  constructor() { }

  ngOnInit(): void {

    $("input[data-bootstrap-switch]").each(function() {
      $(this).bootstrapSwitch('state',  $(this).prop('checked'));
    });

  

 
  }

}
