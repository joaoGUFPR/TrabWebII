// src/app/pages/visualizar-solicitacao/visualizar-solicitacao.component.ts
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { SolicitacaoService } from '../../services/soliciticao.service';
import { ClienteService }      from '../../services/cliente.service';
import { FuncionarioService }  from '../../services/funcionario.service';
import { Solicitacao }         from '../../shared/models/solicitacao';
import { Cliente }             from '../../shared/models/cliente';
import { NavbarFuncionarioComponent } from '../navbarfuncionario/navbarfuncionario.component';

@Component({
  selector: 'app-visualizar-solicitacao',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    NavbarFuncionarioComponent
  ],
  templateUrl: './visualizar-solicitacao.component.html',
  styleUrls: ['./visualizar-solicitacao.component.css']
})
export class VisualizarSolicitacaoComponent implements OnInit {
  solicitacoes:            Solicitacao[] = [];
  solicitacoesFiltradas:   Solicitacao[] = [];

  filtroTipo: 'hoje' | 'periodo' | 'todas' = 'todas';
  dataInicio = '';
  dataFim    = '';

  // mapa CPF → nome de cliente
  private clienteMap = new Map<string,string>();

  constructor(
    private solicitacaoService: SolicitacaoService,
    private clienteService: ClienteService,
    private funcionarioService: FuncionarioService
  ) {}

  ngOnInit(): void {
    // 1) preenche o map de clientes
    this.clienteService.listarTodos().subscribe({
      next: (clientes: Cliente[]) => {
        clientes.forEach(c => this.clienteMap.set(c.cpf, c.nome));
      },
      error: err => console.error('Erro ao carregar clientes', err)
    });

    // 2) carrega todas as solicitações
    this.solicitacaoService.listarTodos().subscribe({
      next: lista => {
        // ordena por data/hora
        this.solicitacoes = lista.sort((a, b) =>
          new Date(a.dataHora).getTime() - new Date(b.dataHora).getTime()
        );
        this.aplicarFiltro();
      },
      error: err => console.error('Erro ao listar solicitações', err)
    });
  }

  aplicarFiltro(): void {
    // agora passa apenas: filtroTipo, dataInicio, dataFim e a lista completa
    this.solicitacoesFiltradas = this.solicitacaoService.listarParaVisualizacao(
      this.filtroTipo,
      this.dataInicio,
      this.dataFim,
      this.solicitacoes
    );
  }

  finalizarSolicitacao(s: Solicitacao): void {
    this.solicitacaoService.finalizarSolicitacao(
      s.dataHora,
      s.valorOrcamento!,
      s.observacoesOrcamento!,
      this.funcionarioService.idLogado
    ).subscribe({
      next: updated => {
        if (updated) {
          s.estado = 'Finalizada';
          this.aplicarFiltro();
        }
      },
      error: err => console.error('Erro ao finalizar solicitação', err)
    });
  }

  getNomeCliente(cpf: string): string {
    return this.clienteMap.get(cpf) || cpf;
  }
}
