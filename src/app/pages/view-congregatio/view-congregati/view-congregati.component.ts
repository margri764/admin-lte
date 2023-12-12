import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { delay } from 'rxjs';
import { User } from 'src/app/shared/models/user.models';
import { CongregatioService } from 'src/app/shared/services/congregatio/congregatio.service';
import { ErrorService } from 'src/app/shared/services/error/error.service';

@Component({
  selector: 'app-view-congregati',
  templateUrl: './view-congregati.component.html',
  styleUrls: ['./view-congregati.component.css']
})

export class ViewCongregatiComponent implements OnInit {

  @ViewChild('gallery') gallery!: ElementRef;
user! : any;
isLoading : boolean = false;

  constructor(
                private activatedRoute : ActivatedRoute,
                private congregatioService : CongregatioService,
                private errorService : ErrorService

  ) {

    this.activatedRoute.params.subscribe(
      ({id})=>{ this.getUserById(id) });
   }

  ngOnInit(): void {

    this.errorService.closeIsLoading$.pipe(delay(700)).subscribe(emitted => emitted && (this.isLoading = false));

  }

  getUserById( id:any ){

    this.isLoading = true;

    this.congregatioService.getUserCongregatioById(id).subscribe(
    ( {success, user})=>{
      if(success){
        this.user = user;
        this.getImages(user);
        this.isLoading = false;
        console.log(user);
      }
    })

  }

  getObjectProperties(): { key: string, value: any }[] {
      
    if(this.user){
      return Object.keys(this.user).map(key => ({ key, value: this.user![key as keyof User] }));
    }
    return [{key:'', value:''}]
  }

  getImages(user: any) {
    const total = user['Ruta Imagen'];
  
    const match = total.match(/\[(\d+)\]/);
    const indice = match ? parseInt(match[1], 10) : null;
  
    const restoDelPath = total.replace(/\[\d+\]\.jpg$/, '');
    const path = "https://congregatio.info/";
  
    // Verificar si hay un índice antes de entrar en el bucle
    if (indice !== null) {
      for (let i = indice; i >= 1; i--) {
        const img = document.createElement("img");
  
        img.className = "img-fluid";
        img.src = `${path}${restoDelPath}[${i}].jpg`;
  
        img.alt = `Foto ${i} do Perfil do Usuário`;

        this.imageExists(img.src, (exists) => {
          if (exists) {
            img.style.border = "2px solid white";
            console.log(img.src);
            this.gallery.nativeElement.appendChild(img);
          }
        });
  
      }

    } else {
      // Si no hay un índice, significa que solo hay una imagen
      const img = document.createElement("img");
  
      img.className = "img-fluid";
      img.src = `${path}${restoDelPath}`;
  
      img.alt = `Foto do Perfil do Usuário`;
  
      // Aplicar el estilo de borde blanco
      img.style.border = "2px solid white";
  
      this.gallery.nativeElement.appendChild(img);
    }
  }
  
  imageExists(url: string, callback: (exists: boolean) => void) {
    const img = new Image();
    img.onload = () => callback(true);
    img.onerror = () => callback(false);
    img.src = url;
  }

}
