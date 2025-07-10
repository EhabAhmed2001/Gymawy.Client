import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, input, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ImageSliderComponent } from '../image-slider/image-slider.component';

@Component({
  selector: 'app-upload-images',
  imports: [CommonModule , ImageSliderComponent,ReactiveFormsModule],
  templateUrl: './upload-images.component.html',
  styleUrl: './upload-images.component.css'
})
export class UploadImagesComponent {
  @Input() imagesUrl:string[]=[]
  images:File[]=[]
  @Output() imageUpload=new EventEmitter<File[]>();
  @Input() control!:FormControl;


  uploadImage(event:any){
    const input = event.target as HTMLInputElement
    this.control.markAsTouched()

    if(!input.files) return

    this.imagesUrl = []
    this.images= Array.from(input.files)

    for(const img of this.images){
      const fileReader = new FileReader();
      fileReader.onload=(e:any)=>{
        this.imagesUrl.push(e.target.result)
      }
      fileReader.readAsDataURL(img)
    }
    console.log(this.imagesUrl)
   // this.control.setValue(this.images);
    this.imageUpload.emit(this.images);
  }

}
