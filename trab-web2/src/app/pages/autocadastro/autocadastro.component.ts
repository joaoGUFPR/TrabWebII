import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';

import { Cliente } from '../../shared/models/cliente';
import { ClienteService } from '../../services/cliente.service';

interface ViaCepResponse {
  cep: string;
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
  complemento?: string;
  erro?: boolean;
}

@Component({
  selector: 'app-autocadastro',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgxMaskDirective,
    NgxMaskPipe
  ],
  templateUrl: './autocadastro.component.html',
  styleUrls: ['./autocadastro.component.css'],
  providers: [ provideNgxMask() ]
})
export class AutocadastroComponent {
  cliente: Cliente = new Cliente(
    '', '', '', 'cliente',
    '', '', '', '', '', '', '', '', ''
  );

  constructor(
    private clienteService: ClienteService,
    private http: HttpClient,
    private router: Router
  ) {}

  inserir(): void {
    this.clienteService.inserir(this.cliente)
      .subscribe({
        next: (created: Cliente | null) => {
          if (created) {
            alert('Cliente cadastrado com sucesso!');
            this.router.navigate(['/login']);
          } else {
            alert('Não foi possível cadastrar o cliente. Tente outro CPF.');
          }
        },
        error: err => {
          console.error('Erro ao cadastrar cliente', err);
          if (err.status === 400) {
            alert('CPF ou e-mail já cadastrado.');
          } else {
            alert('Erro inesperado no cadastro. Tente novamente mais tarde.');
          }
        }
      });
  }

  onCepBlur(): void {
    const cepRaw = this.cliente.cep.replace(/\D/g, '');
    if (cepRaw.length !== 8) {
      // opcional: limpar campos de endereço se desejar
      return;
    }

    this.http.get<ViaCepResponse>(`https://viacep.com.br/ws/${cepRaw}/json/`)
      .subscribe({
        next: data => {
          if (data.erro) {
            alert('CEP não encontrado.');
            return;
          }
          this.cliente.rua         = data.logradouro;
          this.cliente.bairro      = data.bairro;
          this.cliente.cidade      = data.localidade;
          this.cliente.estado      = data.uf;
          this.cliente.complemento = data.complemento || '';
        },
        error: () => {
          alert('Falha ao obter endereço via CEP.');
        }
      });
  }
}
