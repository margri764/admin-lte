import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.components.css']
})
export class PagesComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {

    const shouldReloadPage = localStorage.getItem('shouldReloadPage');
    if (shouldReloadPage !== 'false') {
      this.reloadPage();
      localStorage.setItem('shouldReloadPage', 'false');
    }
  }

  reloadPage(): void {
    window.location.reload();
  }

}
