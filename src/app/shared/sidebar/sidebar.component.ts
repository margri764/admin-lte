import { Component, OnInit } from '@angular/core';
import { ErrorService } from '../services/error/error.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  constructor(
              private errorService : ErrorService
  ) { }

  ngOnInit(): void {
  }

  logout(){
    setTimeout(()=>{ this.errorService.logout(); },600)
    
  }

}
