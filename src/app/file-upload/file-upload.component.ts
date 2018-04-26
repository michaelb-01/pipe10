import { Component, OnInit } from '@angular/core';

//import { upload } from '../../../api/methods';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent implements OnInit {
  fileIsOver: boolean = false;
  uploading: boolean = false;

  borderStyle = 'dashed';

  constructor() { }

  ngOnInit() {
  }

  onDrop(event) {
    event.preventDefault();
    this.borderStyle = 'dashed';
    console.log('drop');
    console.log(event);
    console.log(event.dataTransfer.files[0]);
  }

  onDragOver(event) {
    event.preventDefault();
  }

  onDragEnd(event) {
    event.preventDefault();
    this.borderStyle = 'dashed';
    console.log('dropped');
  }

  onDragEnter(event) {
    event.preventDefault();
    this.borderStyle = 'solid';
    console.log('drag enter');
  }

  onDragLeave(event) {
    event.preventDefault();
    this.borderStyle = 'dashed';
  }

  imageLoaded(event): void {
    console.log('image loaded');
    let imgWidth = event.target.width;

    console.log(imgWidth);
  }

  fileChoose(event) {
    
  }

  // fileChoose(event) {
  //   let file = event.srcElement.files[0];

  //   // Only process image files.
  //   if (!file.type.match('image.*')) {
  //     console.log('file is not an image');
  //     return;
  //   }

  //   this.uploading = true;

  //   var reader = new FileReader();
  //   reader.readAsDataURL(file);

  //   reader.addEventListener('load', (e:any) => {
  //     console.log('reader loaded');
  //     //Initiate the JavaScript Image object.
  //     let image = new Image();

  //     //Set the Base64 string return from FileReader as source.
  //     image.src = e.target.result;

  //     image.addEventListener('load', (e) => {
  //       console.log('image loaded');
  //       upload(file, image.width, image.height)
  //         .then(() => {
  //           this.uploading = false;
  //         })
  //         .catch((error) => {
  //           this.uploading = false;
  //           console.log(`Something went wrong!`, error);
  //         });
  //     });

  //   }); 

  // }

}
