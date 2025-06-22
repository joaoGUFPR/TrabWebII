// src/app/pages/pagarservico/pagarservico.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { Solicitacao } from '../../shared/models/solicitacao';
import { Cliente }     from '../../shared/models/cliente';

import { SolicitacaoService } from '../../services/soliciticao.service';
import { ClienteService }     from '../../services/cliente.service';
import { FuncionarioService } from '../../services/funcionario.service';

import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-pagarservico',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NavbarComponent],
  templateUrl: './pagarservico.component.html',
  styleUrls: ['./pagarservico.component.css']
})
export class PagarservicoComponent implements OnInit {
  solicitacao!: Solicitacao;
  cliente!: Cliente;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private solicitacaoSvc: SolicitacaoService,
    private clienteSvc: ClienteService,
    private funcionarioService: FuncionarioService
  ) {}

  ngOnInit(): void {
    const dataHoraParam = this.route.snapshot.paramMap.get('dataHora');
    if (!dataHoraParam) {
      this.router.navigate(['/paginainicialcliente']);
      return;
    }

    this.solicitacaoSvc.buscarSolicitacaoPorDataHora(dataHoraParam).subscribe({
      next: sol => {
        if (!sol) {
          this.router.navigate(['/paginainicialcliente']);
          return;
        }
        this.solicitacao = sol;
        this.clienteSvc.buscarPorcpf(sol.cpfCliente).subscribe({
          next: c => {
            if (!c) {
              this.router.navigate(['/paginainicialcliente']);
            } else {
              this.cliente = c;
            }
          },
          error: err => {
            console.error('Erro ao buscar cliente:', err);
            this.router.navigate(['/paginainicialcliente']);
          }
        });
      },
      error: err => {
        console.error('Erro ao buscar solicitação:', err);
        this.router.navigate(['/paginainicialcliente']);
      }
    });
  }

  confirmarPagamento(): void {
    const iso = new Date(this.solicitacao.dataHora).toISOString();
    this.solicitacaoSvc.registrarPagamento(
      iso,
      '',
      this.funcionarioService.idLogado
    ).subscribe({
      next: _ => this.router.navigate(['/paginainicialcliente']),
      error: err => {
        console.error('Erro ao registrar pagamento:', err);
        alert('Não foi possível registrar o pagamento.');
      }
    });
  }
}
