import { Component, OnInit } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject, delay } from 'rxjs';
import { ErrorService } from 'src/app/shared/services/error/error.service';
import { UserService } from 'src/app/shared/services/user/user.service';
import { LanguageApp } from '../../table.languaje';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  isLoading : boolean = false;
  users : any []=[];
  
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  dtElement!: DataTableDirective;
  isDtInitialized:boolean = false;
  
  
    constructor(
                private userService : UserService,
                private errorService : ErrorService
    ) { 
  
    }
  
    ngOnInit(): void {
  
    this.errorService.closeIsLoading$.pipe(delay(700)).subscribe( (emitted) => {if(emitted){this.isLoading = false;}});
    this.dtOptions = { language: LanguageApp.portuguese_brazil_datatables,  pagingType: 'full_numbers', responsive: true }
  
    this.getInitialData();
  
    }
  
    getInitialData(){
      this.isLoading = true;
  
      this.userService.getAdmins().subscribe( 
        ( {success, users} )=>{
          setTimeout(()=>{this.isLoading = false },700)
         
          if(success){
               this.users = users;
  
              if (this.isDtInitialized) {
                this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
                  dtInstance.destroy();
                  this.dtTrigger.next(null)
                 
                });
              } else {
                this.isDtInitialized = true
                this.dtTrigger.next(null)
  
              }
     } })
      
  
    }
  
    ngOnDestroy(): void {
        this.dtTrigger.unsubscribe();
    
     
    }
    
  
  
  }