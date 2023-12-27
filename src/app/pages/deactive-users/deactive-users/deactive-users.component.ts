import { Component, OnDestroy, OnInit } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject, delay } from 'rxjs';
import { ErrorService } from 'src/app/shared/services/error/error.service';
import { UserService } from 'src/app/shared/services/user/user.service';
import { LanguageApp } from '../../table.languaje';
import { AuthService } from 'src/app/shared/services/auth/auth.service';

@Component({
  selector: 'app-deactive-users',
  templateUrl: './deactive-users.component.html',
  styleUrls: ['./deactive-users.component.css']
})
export class DeactiveUsersComponent implements OnInit, OnDestroy {


  isLoading : boolean = false;
  users : any []=[];
  
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  dtElement!: DataTableDirective;
  isDtInitialized:boolean = false;
  
  isChecked : boolean = false;
  msg : string = '';
  showSuccess : boolean = false;
  phone : boolean = false;

  
  
    constructor(
                private userService : UserService,
                private errorService : ErrorService,
                private authService : AuthService
    ) { 

  (screen.width <= 800) ? this.phone = true : this.phone = false;

  
    }
  
    ngOnInit(): void {
  
    this.errorService.closeIsLoading$.pipe(delay(700)).subscribe( (emitted) => {if(emitted){this.isLoading = false;}});
    this.dtOptions = { language: LanguageApp.portuguese_brazil_datatables,  pagingType: 'full_numbers', responsive: true }
  
    this.getInitialData();
  
    }
  
    getInitialData(){
      this.isLoading = true;
  
      this.userService.getAllDeactiveUsers().subscribe( 
        ( {success, users} )=>{
          setTimeout(()=>{this.isLoading = false },700)
         
          if(success){
               this.users = users;
  
              if (this.isDtInitialized) {
                this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
                  dtInstance.destroy();
                  this.dtTrigger.next(null);
                });
              } else {
                this.isDtInitialized = true
              }
              this.dtTrigger.next(null);
     } })
      
  
    }

    activeDeacTive(event: any, email:string): void{

      const isChecked = (event.target as HTMLInputElement).checked;

      let active : string;
      
      this.isLoading = true;
      this.showSuccess = false;

      (isChecked) ? active = '1' :  active = '0';
      
      this.authService.activeAccount( email, active ).subscribe(
         ({success})=>{
            if(success){
              this.msg = 'Usúario ativado com sucesso'; 
              this.showSuccess = true;
              this.getInitialData();
            }
        })
    }

    closeToast(){
      this.showSuccess = false;
    }
  
    ngOnDestroy(): void {
      this.dtTrigger.unsubscribe();
    }
    
  
  }
  
  