// src/app/pages/pagina-inicial-funcionario/pagina-inicial-funcionario.component.ts
import { Component, OnInit }     from '@angular/core';
import { CommonModule }          from '@angular/common';
import { Router }                from '@angular/router';
import { NavbarFuncionarioComponent } from '../navbarfuncionario/navbarfuncionario.component';

import { SolicitacaoService }    from '../../services/soliciticao.service';
import { ClienteService }        from '../../services/cliente.service';
import { FuncionarioService }    from '../../services/funcionario.service';

import { Solicitacao }           from '../../shared/models/solicitacao';
import { Cliente }               from '../../shared/models/cliente';

@Component({
  selector: 'app-pagina-inicial-funcionario',
  standalone: true,
  imports: [ NavbarFuncionarioComponent, CommonModule ],
  templateUrl: './pagina-inicial-funcionario.component.html',
  styleUrls: ['./pagina-inicial-funcionario.component.css']
})
export class PaginaInicialFuncionarioComponent implements OnInit {
  solicitacoes: Solicitacao[] = [];
  carregando   = false;
  erro?: string;

  // mapa CPF → nome
  clienteMap = new Map<string,string>();

  constructor(
    private solicitacaoService: SolicitacaoService,
    private clienteService:      ClienteService,
    private funcionarioService:  FuncionarioService,
    private router:              Router
  ) {}

  ngOnInit(): void {
    this.carregando = true;
    this.erro       = undefined;
    console.log(this.funcionarioService.idLogado)

    // 1) carrega todos os clientes UMA vez e popula o map
    this.clienteService.listarTodos().subscribe({
      next: clis => {
        clis.forEach(c => this.clienteMap.set(c.cpf, c.nome));
        // 2) só depois carrega solicitações
        this.loadSolicitacoesAbertas();
      },
      error: errCli => {
        console.error('Erro ao carregar clientes', errCli);
        this.erro       = 'Falha ao carregar clientes.';
        this.carregando = false;
      }
    });
  }

  private loadSolicitacoesAbertas() {
    this.solicitacaoService.listarTodos().subscribe({
      next: all => {
        this.solicitacoes = all
          .filter(s => s.estado === 'Aberta')
          .sort((a, b) =>
            new Date(a.dataHora).getTime() - new Date(b.dataHora).getTime()
          );
        this.carregando = false;
      },
      error: err => {
        console.error('Erro ao carregar solicitações', err);
        this.erro       = 'Falha ao carregar solicitações.';
        this.carregando = false;
      }
    });
  }

  /** Busca nome já em memória — sem HTTP aqui! */
  getNomeCliente(cpf: string): string {
    return this.clienteMap.get(cpf) || cpf;
  }

  irParaOrcamento(s: Solicitacao): void {
    const safeDate = encodeURIComponent(s.dataHora);
    const id       = this.funcionarioService.idLogado;
    this.router.navigate(['/orcamento', safeDate, id]);
  }
}
