import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, ValidatorFn, AbstractControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../Services/auth.service';
import { CommonModule } from '@angular/common';
import { DatePickerComponent } from '../../../shared/date-picker/date-picker.component';
import { TextInputComponent } from '../../../shared/text-input/text-input.component';
import { MapComponent } from '../../map/map.component';
import { PhotoEditorComponent } from "../../members/photo-editor/photo-editor.component";
import { UploadImagesComponent } from "../../upload-images/upload-images.component";
import { ISpecializationOption } from '../../../Interfaces/ISpecializationOption';
import { CoachService } from '../../../Services/coach.service';

@Component({
  selector: 'app-register-as-coach',
  imports: [CommonModule,
    ReactiveFormsModule,
    TextInputComponent,
    MapComponent,
    FormsModule, PhotoEditorComponent, UploadImagesComponent],
  templateUrl: './register-as-coach.component.html',
  styleUrl: './register-as-coach.component.css'
})
export class RegisterAsCoachComponent implements OnInit {

  maxDate: Date = new Date();
  validationErrors: string[] | undefined;
  specializations: ISpecializationOption[] = [];
  selectedValues: number[] = [];

  constructor(
    private _formBuilder: FormBuilder,
    private _authService: AuthService,
    private _coachService: CoachService,
    private _router: Router,
    private _toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    // this.ReMatch();
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
     this._coachService.getSpecializations().subscribe(data => {
      this.specializations = data;
    });
  }

 onCheckboxChange(value: number, event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    if (isChecked) {
      this.selectedValues.push(value);
    } else {
      this.selectedValues = this.selectedValues.filter(v => v !== value);
    }
  }

  getCombinedEnumValue(): number {
  return this.selectedValues.reduce((acc, val) => acc | val, 0);
 }

  RegisterSubscription: Subscription = new Subscription();

 uploadedCoachImages:File|null = null;

  registerForm = new FormGroup({
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    userName: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
    reasonForJoining: new FormControl(''),
    dateOfBirth: new FormControl('', Validators.required),
    phoneNumber: new FormControl('', Validators.required),
    role: new FormControl('coach', Validators.required),
    address: new FormGroup(
      {
        city: new FormControl('', Validators.required),
        country: new FormControl('', Validators.required),
        street: new FormControl('', Validators.required),
        location: new FormGroup(
          {
            x: new FormControl('', Validators.required),
            y: new FormControl('', Validators.required),
          },
          Validators.required
        ),
      },
      Validators.required
    ),

      photo: new FormControl<File | null>(null, Validators.required),
      cv: new FormControl<File | null>(null, Validators.required),
  });

  get uploadImageControl(): FormControl {
    return this.registerForm.get('photo') as FormControl;
  }
  setUploadedImges(e:any){
    this.uploadedCoachImages = e
  }

  MatchValues(matchTo: string): ValidatorFn {
    return (control: AbstractControl) =>
      control.value === control.parent?.get(matchTo)?.value
        ? null
        : { notMatching: true };
  }

  // Register(registerFormValue: FormGroup): void {
  //   if (registerFormValue.valid) {
  //     const dob = this.GetDateOnly(
  //       registerFormValue.controls['dateOfBirth'].value
  //     );
  //     const values = { ...registerFormValue.value, dateOfBirth: dob };
  //     console.log(values);
  //     this.RegisterSubscription = this._authService
  //       .setCoachRegister(values)
  //       .subscribe({
  //         next: (response) => {
  //           console.log(response);
  //           this._router.navigate(['/trainee-gym']);
  //         },
  //         error: (err) => {
  //           this.validationErrors = err; //will get it back form my interceptor arry error
  //           this._toastrService.error(err.error);
  //         },
  //       });
  //   } else registerFormValue.markAllAsTouched();
  // }

  Register(registerFormValue: FormGroup): void {
  if (registerFormValue.valid) {
    const finalEnumValue = this.getCombinedEnumValue();
    const dob = this.GetDateOnly(registerFormValue.controls['dateOfBirth'].value);

    const formValue = registerFormValue.value;
    formValue.dateOfBirth = dob;

    const formData = new FormData();

    formData.append('FirstName', formValue.firstName);
    formData.append('LastName', formValue.lastName);
    formData.append('UserName', formValue.userName);
    formData.append('Email', formValue.email);
    formData.append('Password', formValue.password);
    formData.append('PhoneNumber', formValue.phoneNumber);
    formData.append('Role', formValue.role);
    formData.append('ReasonForJoining', formValue.reasonForJoining || '');
    formData.append('DateOfBirth', formValue.dateOfBirth);

    formData.append('Address.City', formValue.address.city);
    formData.append('Address.Country', formValue.address.country);
    formData.append('Address.Street', formValue.address.street);
    formData.append('Address.Location.X', formValue.address.location.x);
    formData.append('Address.Location.Y', formValue.address.location.y);

    formData.append('Photo', formValue.photo);
    formData.append('CV', formValue.cv);
    formData.append('Specializations', finalEnumValue.toString());

    this.RegisterSubscription = this._authService
      .setCoachRegister(formData)
      .subscribe({
        next: (response) => {
          console.log(response);
          this._router.navigate(['/login']);
        },
        error: (err) => {
          this.validationErrors = err;
          this._toastrService.error(err.error);
        },
      });
  } else {
    registerFormValue.markAllAsTouched();
  }
}




  private GetDateOnly(dob: string | undefined) {
    if (!dob) return;
    const theDob = new Date(dob);
    return new Date(
      theDob.setMinutes(theDob.getMinutes() - theDob.getTimezoneOffset())
    )
      .toISOString()
      .slice(0, 10);
  }

currentStep = 1;
totalSteps = 4;

nextStep() {
  if (this.currentStep < this.totalSteps)
    this.currentStep++;
  console.log(this.currentStep);

}

previousStep() {
this.currentStep--;
// console.log(this.currentStep);
 if (this.currentStep < 1)
    this._router.navigate(['/register']);
}




  setAddress(event:any){
    console.log(event)
    this.registerForm.get('address.city')?.setValue(event.city)
    this.registerForm.get('address.street')?.setValue(event.street)

    this.registerForm.get('address.country')?.setValue(event.country)

    this.registerForm.get('address.location.x')?.setValue(event.lng)
    this.registerForm.get('address.location.y')?.setValue(event.lat)
  }


cvFile: File | null = null;
photoFile: File | null = null;

onFileChange(event: Event, controlName: 'cv' | 'photo') {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    const file = input.files[0];
    this.registerForm.get(controlName)?.setValue(file);
    this.registerForm.get(controlName)?.markAsDirty();
  }
}



}
