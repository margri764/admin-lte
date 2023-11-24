import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-validate-email',
  templateUrl: './validate-email.component.html',
  styleUrls: ['./validate-email.component.css']
})
export class ValidateEmailComponent implements OnInit {

  code:string = '';
  password:string = '';

  constructor(
            private activatedRoute : ActivatedRoute,
) { 

        this.activatedRoute.params.subscribe(
        ({code})=>{ this.getCodes(code) });

}

  ngOnInit(): void {
    
  }

  getCodes(codes: string) {
    if (codes.length >= 50) {
      this.code = codes.slice(-50); 
      this.password = codes.slice(0, -50).trim();
    } else {
      // Manejar el caso en el que la cadena no tenga al menos 12 caracteres
      console.error('La cadena no tiene al menos 50 caracteres');
    }
  }
  
}