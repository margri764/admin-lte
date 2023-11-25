import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-validate-email',
  templateUrl: './validate-email.component.html',
  styleUrls: ['./validate-email.component.css']
})
export class ValidateEmailComponent implements OnInit {

  code:string = '';
  email:string = '';

  constructor(
            private activatedRoute : ActivatedRoute,
            private authService : AuthService
) { 

        this.activatedRoute.params.subscribe(
        ({code})=>{ this.getCodes(code) });

}

  ngOnInit(): void {
    
  }

  getCodes(codes: string) {
    if (codes.length >= 50) {
      this.code = codes.slice(-50); 
      this.email = codes.slice(0, -50).trim();
    } else {
      // Manejar el caso en el que la cadena no tenga al menos 12 caracteres
      console.error('La cadena no tiene al menos 50 caracteres');
    }
    if(this.code !== '' && this.email !== ''){
      this.validateEmail();
    }
  }

  validateEmail(){

    const body = {email: this.email, code: this.code}
    
    this.authService.validateEmail(body).subscribe(
      ()=>{})
    }

 close(){
  setTimeout(()=>{ window.close(); },700)
  
 }   


  
}