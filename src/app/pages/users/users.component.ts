import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/shared/services/user/user.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  users : any []=[];
  isLoading : boolean = false;
  dtOptions: any = {};

  constructor(
              private userService : UserService
  ) { }

  ngOnInit(): void {

    this.dtOptions = {
      pagingType: 'full_numbers', // Otras opciones de configuración...
    };

    this.initialUsers();

  
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
