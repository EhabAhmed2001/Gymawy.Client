import { Component, OnInit } from '@angular/core';
import { GymService } from '../../Services/gym.service';
import { GymFeature } from '../../Interfaces/Gym/Gym';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Item } from '../../Interfaces/Shared/Shared';

@Component({
  selector: 'app-features',
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './features.component.html',
  styleUrl: './features.component.css'
})
export class FeaturesComponent implements OnInit {
  gymFeatures:GymFeature[]=[]
  standardFeatures:Item[]=[]
  gymId!:number
  imageUrl:string|null=null
  imageFile!:File
  showDialog:boolean=false
  showDeleteModal:boolean=false
  showImagePreview = false;
  previewImageUrl = '';
  isEditing:boolean=false
  featureForm!:FormGroup
  SelectedGymFeature:any;
  constructor(private gymService:GymService , private route:ActivatedRoute){
    this.gymId = Number( route.snapshot.paramMap.get('id'))
    this.featureForm=new FormGroup({
      name:new FormControl("",[Validators.required]), //new FormControl("",this.currentSelectedFeature?.id==-1? Validators.required : null),
      description:new FormControl("",[Validators.required]),
      image:new FormControl(null,[Validators.required]),
      cost:new FormControl(null,[Validators.required,Validators.pattern(/^\d+(\.\d{1,2})?$/),Validators.min(0.01)]),
      isExtra:new FormControl(false)
    })
  }

  ngOnInit(): void {
    this.gymService.GetFeaturesByGymId(this.gymId).subscribe({
      next:(responce)=>{
        this.gymFeatures = responce
        console.log(responce)
      },
      error:(error)=>{
        console.log(error)
      }
    })
    this.gymService.GetGymFeatures().subscribe({
      next:(res)=>{
        this.standardFeatures=res
      },
      error:(e)=>{
        console.log(e)
      }
    })
  }
  uploadLogo(event:any){
     const input = event.target as HTMLInputElement
    if(!input.files) return
    this.imageUrl=null;
    this.imageFile =input.files[0]; 
    const fileReader = new FileReader();
    fileReader.onload=(e:any)=>{
      this.imageUrl=e.target.result
    }
    fileReader.readAsDataURL(input.files[0])   
  }

  openImagePreview(imageUrl: string): void {
    this.previewImageUrl = imageUrl;
    this.showImagePreview = true;
  }
  
  closeImagePreview(): void {
    this.showImagePreview = false;
    this.previewImageUrl = '';
  }

  openDeleteDialog(feature:any){
    this.showDeleteModal=true
    this.SelectedGymFeature=feature
  }
  cancelDelete(){
    this.showDeleteModal=false;
    this.SelectedGymFeature=null
  }
  confirmDelete(){
    this.gymService.DeleteGymFeature(this.SelectedGymFeature.id).subscribe({
      next:(responce)=>{
        const index = this.gymFeatures.findIndex(f => f.id === responce);
        if (index !== -1) {
          this.gymFeatures.splice(index, 1);
      }
      },
      error:(error)=>{
        console.log(error)
      }
    })
    this.cancelDelete();
  }

  openAddDialog(){
    this.showDialog=true;
    this.isEditing=false;

  }
  openEditDialog(feature:any){
    this.showDialog=true;
    this.isEditing=true;
    this.featureForm.patchValue({
      name: feature.isExtra? feature.name: feature.featureId, //new FormControl("",this.currentSelectedFeature?.id==-1? Validators.required : null),
      description:feature.description,
      image:null,
      cost:feature.cost,
      isExtra:feature.isExtra

    })
    this.imageUrl=feature.image
    this.featureForm.get('name')?.disable();
    this.featureForm.get('description')?.disable();
    this.featureForm.get('isExtra')?.disable();
    this.SelectedGymFeature ={...feature}; 

  }

  closeDialog(){
    this.showDialog=false
    this.featureForm.reset({
      name:"", //new FormControl("",this.currentSelectedFeature?.id==-1? Validators.required : null),
      description:"",
      image:null,
      cost:0,
      isExtra:false

    })
    this.imageUrl=null;
    this.SelectedGymFeature = null;
  }

  submitForm(){
    console.log(!this.isEditing)
    if(this.showDialog && !this.isEditing && this.featureForm.valid){

          console.log(!this.isEditing)

      const formData = new FormData();
      formData.append('description',this.featureForm.get('description')?.value)
      formData.append('cost',this.featureForm.get('cost')?.value)
      formData.append('image',this.imageFile)

      if(this.featureForm.get('isExtra')?.value){
          formData.append('name',this.featureForm.get('name')?.value)
          this.gymService.AddExtraGymFeature(this.gymId,formData).subscribe({
            next:(responce)=>{
              this.gymFeatures.push(responce)
              console.log(responce)
              
            },
            error:(erro)=>{
              console.log(erro)
            }
          })
      }
      else {
           formData.append('featureId', this.featureForm.get('name')?.value)
          this.gymService.AddNonExGymFeature(this.gymId,formData).subscribe({
            next:()=>{

            },
            error:(erro)=>{
              console.log(erro)
            }
          })
      }
       
    }
    else if(this.showDialog && this.isEditing && this.featureForm.valid){
        const formData = new FormData();

        formData.append('cost',this.featureForm.get('cost')?.value)
        formData.append('image',this.imageFile)
        this.gymService.UpdateGymFeature(this.SelectedGymFeature?.id,formData).subscribe({
        next:(responce)=>{
          console.log(responce);
           const idx= this.gymFeatures.findIndex(gf=>responce.id==gf.id)
           if(idx!=-1)
            this.gymFeatures[idx] = responce
        },
        error:(erro)=>{
          console.log(erro)
        }
        })
              this.closeDialog();

    }
  }
}
