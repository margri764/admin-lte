import { AfterViewInit, Component, OnInit } from '@angular/core';
import { delay } from 'rxjs';
import { User } from 'src/app/shared/models/user.models';
import { ErrorService } from 'src/app/shared/services/error/error.service';
import { UserService } from 'src/app/shared/services/user/user.service';
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  users : User []=[];
  isLoading : boolean = false;
  dtOptions: DataTables.Settings = {};

  constructor(
              private userService : UserService,
              private errorService : ErrorService
  ) { }



  ngOnInit(): void {
   
    this.dtOptions = {
      pagingType: 'full_numbers'
    };

    this.initialUsers();
    this.errorService.closeIsLoading$.pipe(delay(700)).subscribe(emitted => emitted && (this.isLoading = false));

  
  }

  initialUsers(){
    this.isLoading = true;
    this.userService.getAllUsers().subscribe(
      ( {success, users} )=>{
          if(success){
            this.users = users;
            setTimeout(()=>{ this.isLoading = false },700)
          }
      })

  }

}
