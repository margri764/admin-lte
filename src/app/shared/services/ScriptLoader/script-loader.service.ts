import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ScriptLoaderService {

  constructor() { }

  loadScript(scriptUrl: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = scriptUrl;
      script.onload = () => {
        resolve();
      };
      script.onerror = (error: Event | string) => {
        reject(error);
      };
      document.head.appendChild(script);
    });
  }
}
