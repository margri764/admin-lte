import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ActivationEnd, NavigationEnd, Router, RouterEvent } from '@angular/router';
import { distinctUntilChanged, filter, map, pairwise, take } from 'rxjs';
import { __values } from 'tslib';
import { AppState } from '../redux/app.reducer';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.css']
})
export class BreadcrumbComponent implements OnInit {

  title : any;
  firstPath : string ='Dashboard';
  isFirstActivation = true;
  alarmes : boolean = false;
  usuarios : boolean = false;
  clientes : boolean = false;
  user:any;
  

  constructor(
                private router : Router,
           
  //               private errorService : ErrorService,
  //               private localStorageService : LocalstorageService,
  //               private cookieService : CookieService,
  //               private authService : AuthService,
  ) { 
  
    this.router.events.pipe(
      filter(event => event instanceof ActivationEnd)
    ).subscribe((event) => {
        const activationEndEvent = event as ActivationEnd; // Realiza el casting explícito
        // console.log(activationEndEvent.snapshot.data['title']);
        const title = activationEndEvent.snapshot.data['title'];

        this.changeIcons(title);
        
        if(title !== undefined){
          this.title = activationEndEvent.snapshot.data['title'];
        }
    });
    
  }

  ngOnInit(): void {

  

  }

  // { path: '',  component: DashboardComponent, data:{ title:"Dashboard"}},
  //             { path: 'progress',  component: ProgressComponent , data:{ title:"Progress"}},
  //             { path: 'graphics',  component: Graphic1Component , data:{ title:"Graficas"}},
  //             { path: 'editar-clientes/:id',  component: EditClientComponent , data:{ title:"Editar Clientes"}},
  //             { path: 'editar-usuario/:id',  component: EditUserComponent , data:{ title:"Editar Usuário"}},
  //             { path: 'novo-usuario',  component: NewUserComponent , data:{ title:"Novo Usuário"}},
  //             { path: 'novo-cliente',  component: NewClientComponent , data:{ title:"Novo Cliente"}},

  changeIcons( url : string){
    switch (url) {

      
      case "Alarmes":
                    this.alarmes = true;
                    this.usuarios = false;
                    this.clientes = false;

        break;
                    
      case "Usuários":
                    this.usuarios = true;
                    this.alarmes = false;
                    this.clientes = false;
        break;

      case "Clientes":
                    this.clientes = true;
                    this.usuarios = false;
                    this.alarmes = false;
        break;
    
      default:
        break;
    }
  }

}
