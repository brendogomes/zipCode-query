import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ZipCode } from '../models/zipCode.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class ZipCodeService {
  constructor(private snackBar: MatSnackBar, private http: HttpClient) {}

  // Método que irá exibir as mensagem para orientar o usuário.
  showMessage(msg: string): void {
    this.snackBar.open(msg, 'X', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }

  // Método que irá efetuar a consulta na api do ViaCEP.
  zipCodeQuery(zip: string): Observable<ZipCode> {
    // Interface de resposta da api do ViaCEP.
    interface Response {
      cep: string;
      logradouro: string;
      bairro: string;
      localidade: string;
      uf: string;
    }
    return (
      this.http
        .get<Response>(`https://viacep.com.br/ws/${zip}/json/`)
        // Método pipe que irá transformar a interface de resposta da api para a nossa interface criada em models (inglês).
        .pipe<ZipCode>(
          map((data) => {
            const cepDto: ZipCode = {
              zipcode: data.cep,
              street: data.logradouro,
              neighborhood: data.bairro,
              city: data.localidade,
              state: data.uf,
            };
            return cepDto;
          })
        )
    );
  }
}
