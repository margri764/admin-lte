import { Component, OnInit } from '@angular/core';
import { ADTSettings } from 'angular-datatables/src/models/settings';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css']
})
export class ClientsComponent implements OnInit {

  dtOptions: ADTSettings = {};
  

  constructor() { }

  ngOnInit(): void {

    this.dtOptions = {
      ajax: 'data/data.json',
      columns: [
        {
          title: 'Id (Money)',
          data: 'id',
          // ngPipeInstance: this.pipeCurrencyInstance,
          ngPipeArgs: ['USD','symbol']
        },
        {
          title: 'First name',
          data: 'firstName',
          // ngPipeInstance: this.pipeInstance
        },
        {
          title: 'Last name',
          data: 'lastName',
          // ngPipeInstance: this.pipeInstance
        }
      ]
    };
  }

}
