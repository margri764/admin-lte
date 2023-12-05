import { Component, OnInit } from '@angular/core';
import { delay } from 'rxjs';
import { ErrorService } from 'src/app/shared/services/error/error.service';
import { UserService } from 'src/app/shared/services/user/user.service';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.css']
})
export class GroupsComponent implements OnInit {

  groups : any[]=[];
  isLoading : boolean = false;


  constructor(
              private userService : UserService,
              private errorService : ErrorService
              ) { }

  ngOnInit(): void {

    this.errorService.closeIsLoading$.pipe(delay(1500)).subscribe(emitted => emitted && (this.isLoading = false));

    this.userService.getAllGroups().subscribe(
      ( {success, groups} )=>{
        if(success){
          this.groups = groups;
          setTimeout(()=>{ this.isLoading = false }, 700)
           
        }
      })
  }

}
