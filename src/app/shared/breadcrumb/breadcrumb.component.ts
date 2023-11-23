import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ActivationEnd, NavigationEnd, Router, RouterEvent } from '@angular/router';
import { filter, map, pairwise, take } from 'rxjs';
import { __values } from 'tslib';

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

  constructor(
                private router : Router,
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
console.log(url);
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
