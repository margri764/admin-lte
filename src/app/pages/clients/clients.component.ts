import { Component, OnInit } from '@angular/core';
import { ADTSettings } from 'angular-datatables/src/models/settings';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css']
})
export class ClientsComponent implements OnInit {

  dtOptions: DataTables.Settings = {};
  

  constructor() { }

  ngOnInit(): void {

    this.dtOptions = {
      pagingType: 'full_numbers'
    };
  }

}
