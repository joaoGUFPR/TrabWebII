import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, ParamMap } from '@angular/router';

import { Solicitacao }            from '../../shared/models/solicitacao';
import { Historicosolicitacao }   from '../../shared/models/historicosolicitacao';
import { SolicitacaoService }     from '../../services/soliciticao.service';
import { FuncionarioService }     from '../../services/funcionario.service';
import { NavbarComponent }        from '../navbar/navbar.component';

@Component({
  selector: 'app-visualisarservico',
  standalone: true,
  imports: [ CommonModule, RouterModule, NavbarComponent ],
  templateUrl: './visualisarservico.component.html',
  styleUrls: ['./visualisarservico.component.css']
})
export class VisualisarservicoComponent implements OnInit {
  solicitacao?: Solicitacao;
  historico: Historicosolicitacao[] = [];
  nomeFuncionario = '—';

  private funcionarioMap = new Map<string,string>();


  constructor(
    private route: ActivatedRoute,
    private solicitacaoService: SolicitacaoService,
    private funcionarioService: FuncionarioService
  ) {}

  ngOnInit(): void {


        this.funcionarioService.listarTodos().subscribe({
      next: funcionarios => {
        funcionarios.forEach(f => this.funcionarioMap.set(f.dataNascimento, f.nome));
      },
      error: err => console.error('Erro ao carregar funcionários', err)
    });

    this.route.paramMap.subscribe((params: ParamMap) => {
      const dataHora = params.get('dataHora');
      if (!dataHora) return;

      // 1) carrega a solicitação
      this.solicitacaoService.buscarSolicitacaoPorDataHora(dataHora)
        .subscribe({
          next: s => {
            if (!s) {
              console.error('Solicitação não encontrada');
              return;
            }
            this.solicitacao = s;

            // 2) carrega o histórico
            this.solicitacaoService.listarHistorico(dataHora)
              .subscribe({
                next: lista => this.historico = lista,
                error: err => {
                  console.error('Erro ao carregar histórico', err);
                  this.historico = [];
                }
              });

            // 3) carrega nome do funcionário
            if (s.idFuncionario) {
              this.funcionarioService.buscarPorId(s.idFuncionario)
                .subscribe({
                  next: f => this.nomeFuncionario = f?.nome ?? s.idFuncionario,
                  error: err => {
                    console.error('Erro ao buscar funcionário', err);
                    this.nomeFuncionario = s.idFuncionario!;
                  }
                });
            }
          },
          error: err => console.error('Erro ao buscar solicitação', err)
        });
    });
  }

  resgatar(): void {
  if (!this.solicitacao) return;
  this.solicitacaoService.resgatarSolicitacao(
    this.solicitacao.dataHora!,
    '' // alguma observação, se for o caso
  ).subscribe({
    next: updated => {
      if (updated) {
        // recarrega tudo
        this.ngOnInit();
      }
    },
    error: err => console.error('Erro ao resgatar solicitação', err)
  });

}

  getNomeFuncionario(id: string): string {
    return this.funcionarioMap.get(id) || id;
  }
}
