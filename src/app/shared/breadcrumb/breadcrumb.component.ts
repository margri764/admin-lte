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

  constructor(
                private router : Router,
  ) { 
  

   

    this.router.events.pipe(
      filter(event => event instanceof ActivationEnd)
    ).subscribe((event) => {
        const activationEndEvent = event as ActivationEnd; // Realiza el casting explícito
        // console.log(activationEndEvent.snapshot.data['title']);
        const title = activationEndEvent.snapshot.data['title'];
        
        if(title !== undefined){
          this.title = activationEndEvent.snapshot.data['title'];

        }
      });
  
    
  }

  ngOnInit(): void {

  


  }

}
