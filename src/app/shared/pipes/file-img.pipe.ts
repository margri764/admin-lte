// file-type.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fileType'
})
export class FileTypePipe implements PipeTransform {
  transform(type: string): string {
    const imageTypes = ['img', 'jpeg', 'jpg', 'png', 'gif', 'image/jpeg']; // Ajusta según tus tipos de imágenes conocidos
    return imageTypes.includes(type.toLowerCase()) ? 'image' : 'pdf';
  }
}
