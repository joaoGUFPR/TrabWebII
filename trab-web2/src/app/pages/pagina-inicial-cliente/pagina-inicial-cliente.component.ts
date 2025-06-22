// src/app/pages/pagina-inicial-cliente/pagina-inicial-cliente.component.ts
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { Solicitacao } from '../../shared/models/solicitacao';
import { SolicitacaoService } from '../../services/soliciticao.service';
import { ClienteService }      from '../../services/cliente.service';
import { NavbarComponent }     from '../navbar/navbar.component';

@Component({
  selector: 'app-pagina-inicial-cliente',
  standalone: true,
  imports: [CommonModule, NavbarComponent, RouterModule, RouterLink],
  templateUrl: './pagina-inicial-cliente.component.html',
  styleUrls: ['./pagina-inicial-cliente.component.css']
})
export class PaginaInicialClienteComponent implements OnInit {

    solicitacoes: Solicitacao[] = [];

  constructor(
    private router: Router,
    private solicitacaoService: SolicitacaoService,
    private clienteService: ClienteService
  ) {}

  ngOnInit(): void {
    // 1) pega o CPF


    // 2) carrega do back via HTTP
    this.solicitacaoService.listarSolicitacoesPorCpf(this.clienteService.cpfLogado).subscribe({
      next: list => {
        this.solicitacoes = list.sort((a, b) =>
          new Date(a.dataHora).getTime() - new Date(b.dataHora).getTime()
        );
      },
      error: err => {
        console.error('Erro ao listar solicitações:', err);
        this.solicitacoes = [];
      }
    });
  }

  /**
   * Navega para a página de detalhes do orçamento (cliente aprova/rejeita).
   */
  visualizarSolicitacao(s: Solicitacao): void {
    const id = encodeURIComponent(new Date(s.dataHora).toISOString());
    this.router.navigate(['/mostrar-orcamento', id]);
  }

  /**
   * Se a solicitação já estiver orçada, o cliente pode aprovar ou rejeitar.
   * Aqui vamos simplesmente navegar também, e depois o próprio MostrarOrcamentoComponent
   * vai exibir os botões de aprovar/rejeitar.
   */
  acaoSolicitacao(s: Solicitacao): void {
    this.visualizarSolicitacao(s);
  }


resgatarServico(s: Solicitacao): void {
  // transforma pra ISO, sem encodeURIComponent
  const dataHora = new Date(s.dataHora).toISOString();

  this.solicitacaoService
    .resgatarSolicitacao(
      dataHora,                          // 1) dataHora
      s.observacoesOrcamento || ''       // 3) observações
    )
    .subscribe({
      next: updated => {
        if (updated) {
          s.estado = 'Aprovada';
        }
      },
      error: err => console.error('Erro ao resgatar serviço', err)
    });
}
}
