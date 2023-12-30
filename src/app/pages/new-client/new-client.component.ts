import { Component, ElementRef, HostListener, OnInit, ViewChild, ViewContainerRef } from '@angular/core';

@Component({
  selector: 'app-new-client',
  templateUrl: './new-client.component.html',
  styleUrls: ['./new-client.component.css']
})
export class NewClientComponent implements OnInit {

  @HostListener('document:contextmenu', ['$event'])
  onContextMenu(event: MouseEvent): void {
    event.preventDefault();
  // Obtener dimensiones de la pantalla
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;

  // Posición inicial del menú contextual
  const initialX = event.clientX;
  const initialY = event.clientY;

  // Ancho y alto del menú contextual
  const menuWidth = 280; // Ajusta según sea necesario
  const menuHeight = 200; // Ajusta según sea necesario

  // Márgenes mínimos desde los bordes de la pantalla
  const margin = 10;

  // Ajustar la posición si el menú se encuentra cerca de los bordes de la pantalla
  const adjustedX = initialX + menuWidth + margin > screenWidth ? screenWidth - menuWidth - margin : initialX;
  const adjustedY = initialY + menuHeight + margin > screenHeight ? screenHeight - menuHeight - margin : initialY;

  // Asignar la posición ajustada al componente
  this.showContextMenu = true;
  this.contextMenuPosition = { x: adjustedX, y: adjustedY };
  }

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent): void {
    const clickedInside = this.elRef.nativeElement.contains(event.target);
    if (clickedInside) {
      // Si el clic no fue dentro del componente, cierra el menú
      this.showContextMenu = false;
      this.showSubMenu = false;
    }
  }

  showContextMenu = false;
  contextMenuPosition = { x: 0, y: 0 };
  showSubMenu = false;


  constructor(
                 private elRef: ElementRef

              )
 {

 }


  ngOnInit(): void {
      
  }


  manejarItemClick(item: string): void {
    // Lógica para manejar clics en elementos del menú contextual
    console.log(`Elemento del menú clicado: ${item}`);

    // Oculta el menú contextual
    const contextMenu = document.querySelector('app-context-menu');
    if (contextMenu) {
      contextMenu.classList.remove('show'); // Remueve la clase para ocultar el menú
    }
  }

  submenuItemClicked(subitem: string): void {
    console.log(`Subelemento del menú clicado: ${subitem}`);
    this.showSubMenu = false;
  }



  
}