// imagen-path.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'imagenDocPath'
})
export class ImagenDocPathPipe implements PipeTransform {

  transform(doc: any) {

    if (doc && doc.filePath && doc.filePath !== '') {

        const fileName = doc.filePath.split('/').pop();

        const serverURL = 'https://arcanjosaorafael.org/documents/';
        return `${serverURL}${fileName}`;
    } else {
      return doc.filePath;
    }
  }
}

