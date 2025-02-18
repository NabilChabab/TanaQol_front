import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { ButtonModule } from 'primeng/button';
import { StepperModule } from 'primeng/stepper';
import { UserState } from '../../../core/store/user/user.state';
import { Observable } from 'rxjs';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { RoleRequestService } from '../../../core/services/user/role-request.service';

@Component({
  selector: 'app-driver-role-modal',
  standalone: true,
  imports: [StepperModule, ButtonModule, CommonModule, ReactiveFormsModule],
  templateUrl: './driver-role-modal.component.html',
})
export class DriverRoleModalComponent implements OnInit {
  user$: Observable<UserState>;
  step: number = 1;
  fileName: string = '';
  fileLicenseName: string = '';
  fileIInsuranceName: string = '';
  fileSelected: boolean = false;
  fileLicenseSelected: boolean = false;
  fileInsuranceSelected: boolean = false;
  @Input() isOpen = false;
  username: string | null = null;
  firstName: string | null = null;
  lastName: string | null = null;
  dataForm: FormGroup;
  errorMessages: { [key: string]: string } = {};
  loading = false;

  constructor(
    private store: Store<{ user: UserState }>,
    private formBuilder: FormBuilder,
    private roleRequestService: RoleRequestService
  ) {
    this.user$ = this.store.select('user');
    this.dataForm = this.formBuilder.group({
      brand: ['', Validators.required],
      licensePlate: ['', Validators.required],
      licenseNumber: ['', [Validators.required]],
      licenseExpiryDate: ['', Validators.required],
      insuranceProof: [''],
      licenseProof: [''],
      vehicleImage: [''],
      vehicleType: ['', Validators.required],
    });
  }

  sendRequest(): void {
    if (this.dataForm.valid) {
      this.roleRequestService.sendRequest(this.dataForm.value).subscribe({
        next: () => {
          this.loading = false;
          this.isOpen = false;
        },
        error: (error) => {
          setTimeout(() => {
            this.loading = false;
          }, 3000);
          this.errorMessages = {};
          if (error.error) {
            const backendErrors = error.error;
            Object.keys(backendErrors).forEach((key) => {
              this.errorMessages[key] = backendErrors[key];
            });
          } else {
            this.errorMessages['global'] = 'Registration failed';
          }
        },
      });
    }
  }

  ngOnInit() {
    this.user$.subscribe((user) => {
      this.username = user.username;
      if (this.username) {
        const nameParts = this.username.trim().split(/\s+/);
        this.firstName = nameParts[0];
        this.lastName = nameParts.slice(1).join(' ') || '';
      }
    });
  }

  closeDrawer() {
    this.isOpen = false;
  }

  nextStep() {
    if (this.step < 3) {
      this.step++;
    }
  }

  prevStep() {
    if (this.step > 1) {
      this.step--;
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.fileName = input.files[0].name;
      this.fileSelected = true;
      this.dataForm.get('vehicleImage')?.setValue(this.fileName);
    }
  }

  onFileLicenseSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.fileLicenseName = input.files[0].name;
      this.fileLicenseSelected = true;
      this.dataForm.get('licenseProof')?.setValue(this.fileLicenseName);
    }
  }

  onFileInsuranceSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.fileIInsuranceName = input.files[0].name;
      this.fileInsuranceSelected = true;
      this.dataForm.get('insuranceProof')?.setValue(this.fileIInsuranceName);
    }
  }
}
