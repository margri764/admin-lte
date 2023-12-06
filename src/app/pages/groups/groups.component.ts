import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { delay } from 'rxjs';
import { AlarmGroupService } from 'src/app/shared/services/alarmGroup/alarm-group.service';
import { ErrorService } from 'src/app/shared/services/error/error.service';
import { UserService } from 'src/app/shared/services/user/user.service';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.css']
})
export class GroupsComponent implements OnInit {

  @ViewChild('closebutton') closebutton! : ElementRef;
  @ViewChild('closebutton2') closebutton2! : ElementRef;

  groups : any[]=[];
  isLoading : boolean = false;
  myForm!: FormGroup;
  myFormEdit!: FormGroup;
  showSuccess : boolean = false;
  showSuccessCreateGroup : boolean = false;
  phone : boolean = false;
  msg : string = '';





  constructor(
              private errorService : ErrorService,
              private fb : FormBuilder,
              private alarmGroupService : AlarmGroupService 
    
              ) 
  {

    this.myForm = this.fb.group({
      name:     [ '', [Validators.required] ],
      description:  [ '', [Validators.required]],
    });

    this.myFormEdit = this.fb.group({
      editName:     [ '' ],
      editDescription:  [ ''],
    });


    (screen.width <= 800) ? this.phone = true : this.phone = false;
   }

  ngOnInit(): void {

    this.errorService.closeIsLoading$.pipe(delay(1500)).subscribe(emitted => emitted && (this.isLoading = false));
    this.getInitialGroups();

  }

  getInitialGroups(){

    this.alarmGroupService.getAllGroups().subscribe(
      ( {success, groups} )=>{
        if(success){
          this.groups = groups;
          setTimeout(()=>{ this.isLoading = false }, 700)
        }
      })
  }

onSave(){

  this.isLoading = true;
  this.showSuccessCreateGroup = false;
  this.alarmGroupService.createGroup( this.myForm.value ).subscribe(
    ( {success} )=>{
      if(success){
        setTimeout(()=>{ this.isLoading = false; },400);
        this.closebutton.nativeElement.click();
        this.msg = 'Grupo criado corretamente'
        this.showSuccessCreateGroup = true;
        this.getInitialGroups();

      }
    })
}

tempId= null;
editGroup( group:any ){
  console.log(group);

  
    this.myFormEdit.patchValue({
      editName: group.name,
      editDescription: group.description,
    });

    this.tempId = group.idgroup
  
 
}

saveEdition(  ){

  this.isLoading = true;
  this.showSuccessCreateGroup = false;
  

  const name = this.myFormEdit.get("editName")?.value;
  const description = this.myFormEdit.get("editDescription")?.value;
  
  const body = { name , description }
  
  this.alarmGroupService.editGroup( this.tempId, body).subscribe(
    ( {success} )=>{
      if(success){
        setTimeout(()=>{ this.isLoading = false; },400);
        this.closebutton2.nativeElement.click();
        this.msg = 'Grupo editado corretamente'
        this.showSuccessCreateGroup = true;
        this.getInitialGroups();

      }
    })

}


validField( field: string ) {
  const control = this.myForm.controls[field];
  return control && control.errors && control.touched;
}


validFieldEdit( field: string ) {
  const control = this.myFormEdit.controls[field];
  return control && control.errors && control.touched;
}

onRemove( group:any ){

  this.alarmGroupService.authDelGroup$.subscribe(
    (auth)=>{
      if(auth){
        this.isLoading = true;
        this.showSuccess = false;
        this.alarmGroupService.deleteGroup( group.idgroup ).subscribe(
          ( {success} )=>{
            setTimeout(()=>{ this.isLoading = false },700)
            if(success){
              this.getInitialGroups();
              this.msg = "Grupo eliminado com sucesso."
              this.showSuccess = true;
            }
          })
      }
    })

}

continue( ){
  this.alarmGroupService.authDelGroup$.emit(true);
}

closeToast(){
  this.showSuccess = false;
}


}
