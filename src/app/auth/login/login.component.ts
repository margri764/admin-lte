import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  myForm!: FormGroup;
  myForm2!: FormGroup;
  myFormCode!: FormGroup;
  submitted : boolean = false;
  showLogin: boolean = true;


  constructor(
              private fb : FormBuilder,
              private router : Router
  ) {

     
   }

  ngOnInit(): void {

    this.myForm = this.fb.group({
      email:     [ '', [Validators.required] ],
      password:  [ '', [Validators.required]],
  
    });

    this.myForm2 = this.fb.group({
      name:     [ '', [Validators.required] ],
      ordem:     [ '', [Validators.required] ],
      email2:     [ '', [Validators.required] ],
      subject:     [ '', [Validators.required] ],
      message:     [ '', [Validators.required] ],
      sendEmail:     [ false, [Validators.required] ],
  
    });

    this.myFormCode = this.fb.group({
      code:     [ '', [Validators.required] ],
  
    });
    

  }

  login(){

    this.showLogin = false;
    this.submitted = true;
    // if ( this.myForm.invalid ) {
    //   this.myForm.markAllAsTouched();
    //   return;
    // }

    // this.router.navigateByUrl('/dashboard')
    
  }

  validField( field: string ) {
    return this.myForm.controls[field].errors && this.myForm.controls[field].touched;
}

}