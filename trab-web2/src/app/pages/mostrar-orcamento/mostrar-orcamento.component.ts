// src/app/pages/mostrar-orcamento/mostrar-orcamento.component.ts
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterModule, ActivatedRoute, Router } from '@angular/router';

import { Solicitacao } from '../../shared/models/solicitacao';
import { Historicosolicitacao } from '../../shared/models/historicosolicitacao';
import { SolicitacaoService } from '../../services/soliciticao.service';
import { NavbarComponent }    from '../navbar/navbar.component';

@Component({
  selector: 'app-mostrar-orcamento',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    RouterLink,
    NavbarComponent
  ],
  templateUrl: './mostrar-orcamento.component.html',
  styleUrls: ['./mostrar-orcamento.component.css']
})
export class MostrarOrcamentoComponent implements OnInit {
  solicitacao!: Solicitacao;

  constructor(
    private solicitacaoService: SolicitacaoService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const dataHoraParam = params['dataHora'];
      this.solicitacaoService.buscarSolicitacaoPorDataHora(dataHoraParam)
        .subscribe({
          next: sol => {
            if (!sol) {
              console.error('Solicitação não encontrada!');
              this.router.navigate(['/paginainicialcliente']);
            } else {
              this.solicitacao = sol;
            }
          },
          error: err => {
            console.error('Erro ao buscar solicitação:', err);
            this.router.navigate(['/paginainicialcliente']);
          }
        });
    });
  }

aprovarServico(): void {
  const dh = new Date(this.solicitacao.dataHora).toISOString();
  this.solicitacaoService
    .aprovarSolicitacao(
      dh,
      this.solicitacao.idFuncionario,
      this.solicitacao.observacoesOrcamento || ''
    )
    .subscribe({
      next: () => {
        alert('Serviço aprovado!');
        this.router.navigate(['/paginainicialcliente']);
      },
      error: err => {
        console.error('Erro ao aprovar:', err);
        alert('Falha ao aprovar o serviço.');
      }
    });
}

rejeitarServico(): void {
  const dh = new Date(this.solicitacao.dataHora).toISOString();
  this.solicitacaoService
    .rejeitarSolicitacao(
      dh,
      this.solicitacao.idFuncionario,
      this.solicitacao.observacoesOrcamento || ''
    )
    .subscribe({
      next: () => {
        alert('Serviço rejeitado.');
        this.router.navigate(['/paginainicialcliente']);
      },
      error: err => {
        console.error('Erro ao rejeitar:', err);
        alert('Falha ao rejeitar o serviço.');
      }
    });
}
}
