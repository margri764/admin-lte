// imagen-path.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'imagenPath'
})
export class ImagenPathPipe implements PipeTransform {

  transform(user: any): string {

    console.log(user);
    if (user && user.Ruta_Imagen && user.Ruta_Imagen !== '') {
      if (user.Ruta_Imagen.startsWith('https://congregatio.info/')) {
        return user.Ruta_Imagen;
      } else {
        const fileName = user.Ruta_Imagen.split('/').pop();
        const serverURL = 'https://arcanjosaorafael.org/profilePicture/';
        console.log(`${serverURL}${fileName}`);
        return `${serverURL}${fileName}`;
      }
    } else {
      return '';
    }
  }
}

