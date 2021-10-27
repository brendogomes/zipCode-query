import { FormBuilder, FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ZipCodeService } from 'src/app/services/zipCode.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  zipCodeForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private zipCodeService: ZipCodeService
  ) {}

  ngOnInit(): void {
    this.createFormZipCode();
  }

  // Método que irá criar o fomulário.
  createFormZipCode(): void {
    this.zipCodeForm = this.formBuilder.group({
      zipcode: [null],
      street: [null],
      neighborhood: [null],
      city: [null],
      state: [null],
    });
  }

  // Método para popular os campos com as informações da api do cep.
  formZipCode(): void {
    if (this.zipCodeForm.value.zipcode) {
      this.zipCodeService
        .zipCodeQuery(this.zipCodeForm.value.zipcode)
        .toPromise()
        .then(
          (data) => {
            this.zipCodeForm.patchValue({
              zipcode: data.zipcode,
              street: data.street,
              neighborhood: data.neighborhood,
              city: data.city,
              state: data.state,
            });
          },
          (error) => {
            this.zipCodeService.showMessage('CEP inválido');
          }
        );
    } else {
      this.zipCodeService.showMessage('Preencha o campo CEP');
    }
  }
}
