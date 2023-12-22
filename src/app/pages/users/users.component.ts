import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Subject, delay } from 'rxjs';
import { User } from 'src/app/shared/models/user.models';
import { ErrorService } from 'src/app/shared/services/error/error.service';
import { UserService } from 'src/app/shared/services/user/user.service';
import { LanguageApp } from '../table.languaje';
import { DataTableDirective } from 'angular-datatables';
import { ADTSettings } from 'angular-datatables/src/models/settings';
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit , AfterViewInit {

  users : User []=[];
  isLoading : boolean = false;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  constructor(
              private userService : UserService,
              private errorService : ErrorService
  ) { 

  }

  ngAfterViewInit() {
    setTimeout(() => {

    }, 200);
  }
  

  ngOnInit(): void {
   

    this.initialUsers();
    this.errorService.closeIsLoading$.pipe(delay(700)).subscribe(emitted => emitted && (this.isLoading = false));
    this.dtOptions = { language: LanguageApp.portuguese_brazil_datatables,  pagingType: 'full_numbers', responsive: true }


  }

  initialUsers(){
    this.isLoading = true;
    this.userService.getAllUsers().subscribe(
      ( {success, users} )=>{
          if(success){
            this.users = users;
            this.dtTrigger.next(null);
            setTimeout(()=>{ this.isLoading = false },700)
          }

      })

  }


}



