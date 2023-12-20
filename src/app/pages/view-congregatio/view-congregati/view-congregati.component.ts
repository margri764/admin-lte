import { Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { delay } from 'rxjs';
import { User } from 'src/app/shared/models/user.models';
import { CongregatioService } from 'src/app/shared/services/congregatio/congregatio.service';
import { ErrorService } from 'src/app/shared/services/error/error.service';
import { UserService } from 'src/app/shared/services/user/user.service';

@Component({
  selector: 'app-view-congregati',
  templateUrl: './view-congregati.component.html',
  styleUrls: ['./view-congregati.component.css']
})

export class ViewCongregatiComponent implements OnInit, OnChanges {

  @ViewChild('gallery') gallery!: ElementRef;
  @Input() userCongregatio: any;
  @Input() userFromGroup: any;
  user! : any;
  isLoading : boolean = false;

  constructor(
                private errorService : ErrorService,
                private userService : UserService,

  ) {

    // this.activatedRoute.params.subscribe(
    //   ({id})=>{ this.getUserById(id) });
   }

  ngOnInit(): void {

    this.errorService.closeIsLoading$.pipe(delay(700)).subscribe(emitted => emitted && (this.isLoading = false));
      this.getUserById()
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['userCongregatio'] && !changes['userCongregatio'].firstChange) {
      this.getUserById();
    }
  }

  getUserById(  ){

    console.log(this.userFromGroup);
    console.log(this.userCongregatio);

    //el usuario viene de la pestaña Congregatio
    if(this.userFromGroup !== undefined){

      this.isLoading = true;

      this.userService.getUserById(this.userFromGroup.iduser).subscribe(
      ( {success, user})=>{
        if(success){
          this.user = user;
          this.getImages(user);
          this.isLoading = false;
          console.log(user);
        }
      })

    }else{ //el usuario viene de los grupos

      this.user = this.userCongregatio;
      this.getImages(this.user);
      this.isLoading = false;
    }




  }

  getObjectProperties(): { key: string, value: any }[] {
      
    if(this.user){
      return Object.keys(this.user).map(key => ({ key, value: this.user![key as keyof User] }));
    }
    return [{key:'', value:''}]
  }

  getImages(user: any) {

    let total = null;
    if(this.userFromGroup !== undefined){
       total = user.Ruta_Imagen;
       console.log(total);
    }else{
      total = user['Ruta Imagen'];
    }

    if(total === null || total === undefined){

      const img = document.createElement("img");
  
      img.className = "img-fluid";
      img.src = 'assets/no-image.jpg';
  
      img.alt = `Foto do Perfil do Usuário`;
  
      // Aplicar el estilo de borde blanco
      img.style.border = "2px solid white";
  
      this.gallery.nativeElement.appendChild(img);
      return;
    }
  
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
