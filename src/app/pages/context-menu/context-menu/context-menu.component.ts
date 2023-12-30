import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/shared/services/user/user.service';

@Component({
  selector: 'app-context-menu',
  templateUrl: './context-menu.component.html',
  styleUrls: ['./context-menu.component.css']
})
export class ContextMenuComponent implements OnInit, OnDestroy  {

  @Input() showContextMenu = false;
  @Input() contextMenuPosition = { x: 0, y: 0 };

  subscription!: Subscription ;
  selected : boolean = false;
  downloadAll : boolean = false;

  constructor(
              private userService : UserService
  ) { }

  ngOnInit(): void {

    this.subscription = this.userService.changeMenuStates$.subscribe((menuStates) => { this.checkMenuStates(menuStates)
    });
  }

  menuItemClicked(item: string): void {
    
    switch (item) {

      case 'selectAll':
                         this.userService.selectAllDocuments$.emit(true);

        break;

      case 'deleteAll':
                         this.userService.deleteSelectedDocuments$.emit(true);
        break;

      case 'deselectAll':
                         this.userService.deSelectAllDocuments$.emit(true);
                        
        break;
        case 'downloadAll':
                        this.userService.downloadSelectedDocuments$.emit(true);
      
        break;
    
      default:
        break;
    }


    
    // this.showContextMenu = false; 
  }

  checkMenuStates( menuStates:any ): void {
    if(menuStates){
      this.selected = menuStates.selected;
      this.downloadAll = menuStates.selected;
    }
  }
  
  ngOnDestroy(){
    this.subscription.unsubscribe()
 }
 


}
