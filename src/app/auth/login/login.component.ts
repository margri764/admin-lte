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
  submitted : boolean = false;


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
    

  }

  login(){
    this.submitted = true;
    if ( this.myForm.invalid ) {
      this.myForm.markAllAsTouched();
      return;
    }

    this.router.navigateByUrl('/dashboard')

    
  }

  validField( field: string ) {
    return this.myForm.controls[field].errors && this.myForm.controls[field].touched;
}

}