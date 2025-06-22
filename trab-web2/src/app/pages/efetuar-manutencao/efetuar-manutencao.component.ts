// src/app/pages/efetuar-manutencao/efetuar-manutencao.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Solicitacao }               from '../../shared/models/solicitacao';
import { Cliente }                   from '../../shared/models/cliente';
import { Funcionario }               from '../../shared/models/funcionario';

import { SolicitacaoService }        from '../../services/soliciticao.service';
import { ClienteService }            from '../../services/cliente.service';
import { FuncionarioService }        from '../../services/funcionario.service';

import { NavbarFuncionarioComponent } from '../navbarfuncionario/navbarfuncionario.component';

@Component({
  selector: 'app-efetuar-manutencao',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    NavbarFuncionarioComponent
  ],
  templateUrl: './efetuar-manutencao.component.html',
  styleUrls: ['./efetuar-manutencao.component.css']
})
export class EfetuarManutencaoComponent implements OnInit {
  solicitacao?: Solicitacao;
  cliente?:    Cliente;
  funcionarios: Funcionario[] = [];

  exibirFormularioManutencao = false;
  descricaoManutencao = '';
  orientacoesCliente = '';
  destinoFuncionarioId = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private solicitacaoSvc: SolicitacaoService,
    private clienteSvc: ClienteService,
    private funcSvc: FuncionarioService
  ) {}

  ngOnInit(): void {
    const dataHora = this.route.snapshot.paramMap.get('dataHora');
    if (!dataHora) {
      this.router.navigate(['/visualizarsolicitacao']);
      return;
    }

    this.solicitacaoSvc.buscarSolicitacaoPorDataHora(dataHora).subscribe({
      next: sol => {
        if (!sol) {
          this.router.navigate(['/paginainicialfuncionario']);
          return;
        }
        sol.historicoSolicitacao = sol.historicoSolicitacao || [];
        this.solicitacao = sol;

        this.clienteSvc.buscarPorcpf(sol.cpfCliente).subscribe({
          next: cli => this.cliente = cli || undefined,
          error: _ => this.cliente = undefined
        });

        this.funcSvc.listarTodos().subscribe({
          next: list => {
            // comparar dataNascimento, que é a "chave" do funcionário
            this.funcionarios = list.filter(f =>
              f.dataNascimento !== sol.idFuncionario
            );
          },
          error: _ => this.funcionarios = []
        });
      },
      error: _ => {
        this.router.navigate(['/paginainicialfuncionario']);
      }
    });
  }

  toggleManutencao(): void {
    this.exibirFormularioManutencao = true;
  }

  confirmarManutencao(): void {
    if (!this.descricaoManutencao.trim() || !this.orientacoesCliente.trim()) {
      alert('Por favor, preencha todos os campos de manutenção.');
      return;
    }
    if (!this.solicitacao) return;

    const dto = {
      descricaoManutencao: this.descricaoManutencao,
      orientacaoCliente: this.orientacoesCliente,
      funcionarioId: this.funcSvc.idLogado
    };

    this.solicitacaoSvc.efetuarManutencao(
      this.solicitacao.dataHora,
      dto
    ).subscribe({
      next: _ => {
        // navega sem retornar valor
        this.router.navigate(['/visualizarsolicitacao']);
      },
      error: err => {
        console.error('Erro ao confirmar manutenção:', err);
        alert('Erro ao confirmar manutenção. Tente novamente.');
      }
    });
  }

  redirecionarManutencao(): void {
    if (!this.destinoFuncionarioId || !this.solicitacao) {
      alert('Selecione um funcionário para redirecionar.');
      return;
    }
    this.solicitacaoSvc.redirecionarManutencao(
      this.solicitacao.dataHora,
      this.destinoFuncionarioId
    ).subscribe({
      next: _ => {
        this.router.navigate(['/visualizarsolicitacao']);
      },
      error: err => {
        console.error('Erro ao redirecionar manutenção:', err);
        alert('Erro ao redirecionar. Tente novamente.');
      }
    });
  }

  cancelar(): void {
    this.router.navigate(['/visualizarsolicitacao']);
  }
}
