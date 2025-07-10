import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-image-slider',
  imports: [],
  templateUrl: './image-slider.component.html',
  styleUrl: './image-slider.component.css'
})
export class ImageSliderComponent {
  curntImageIdx:number=0
  @Input() imagesUrl:string[]=[]
  nextImage(){
     if(this.curntImageIdx == this.imagesUrl.length-1)
        this.curntImageIdx =0;
     else
        this.curntImageIdx++;
     
  }
  previousImage(){
     if(this.curntImageIdx ==0)
      this.curntImageIdx =this.imagesUrl.length-1;
    else
      this.curntImageIdx--;   
  }
}
