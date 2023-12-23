import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { delay, distinctUntilChanged, filter } from 'rxjs';
import { AppState } from 'src/app/shared/redux/app.reducer';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { ErrorService } from 'src/app/shared/services/error/error.service';
import { getDataSS, saveDataLS } from 'src/app/shared/storage';

@Component({
  selector: 'app-lockscreen',
  templateUrl: './lockscreen.component.html',
  styleUrls: ['./lockscreen.component.css']
})
export class LockscreenComponent implements OnInit {

myForm! : FormGroup
isLoading : boolean = false;
profilePicture : string = "assets/no-image.jpg";
name : string = "";

  constructor(
              private fb : FormBuilder,
              private authService : AuthService,
              private router : Router,
              private errorService : ErrorService,
              private store : Store <AppState>
  ) {
    
    this.myForm = this.fb.group({
      email:  [ '', [Validators.required]],
      password:  [ '', [Validators.required]],
    });

  }

  ngOnInit(): void {

    this.errorService.closeIsLoading$.pipe(delay(1200)).subscribe( (emitted) => { if(emitted){this.isLoading = false}}) ;



    const user = getDataSS('session');
    if(user.email){
      this.name = user.name;
      this.getImage(user.Ruta_Imagen);

      this.myForm = this.fb.group({
        email:  [ user.email ],
        password:  [ '', [Validators.required]],
      });
    }
  }

  login(){


    if ( this.myForm.invalid ) {
      this.myForm.markAllAsTouched();
      return;
    }

    const email = this.myForm.get('email')?.value;
    const password = this.myForm.get('password')?.value;
    this.isLoading = true;
    const session = "true";
    this.authService.login( email, password, session ).subscribe(
      ({success})=>{

        if(success ){
          saveDataLS('logged', true);
          setTimeout(()=>{ 
              saveDataLS("shouldReloadPage", "true")
              this.router.navigateByUrl('/');
            },1700)
              
        }
        });
  }

  getImage( path:string ){
    if(path.startsWith('/var/www/propulsao')){
      const fileName = path.split('/').pop();
      const serverURL = 'https://arcanjosaorafael.org/profilePicture/';
      this.profilePicture = `${serverURL}${fileName}`;
    }else{
      this.profilePicture= path;
    }
  }


  validField(field: string) {
    const control = this.myForm.get(field);
    return control && control.errors && control.touched;
  }


}
