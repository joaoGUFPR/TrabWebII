// src/app/pages/efetuar-orcamento/efetuar-orcamento.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, RouterModule } from '@angular/router';

import { NavbarFuncionarioComponent } from '../navbarfuncionario/navbarfuncionario.component';
import { SolicitacaoService }    from '../../services/soliciticao.service';
import { ClienteService }        from '../../services/cliente.service';
import { FuncionarioService }    from '../../services/funcionario.service';

import { Solicitacao } from '../../shared/models/solicitacao';
import { Cliente }     from '../../shared/models/cliente';

@Component({
  selector: 'app-efetuar-orcamento',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    RouterLink,
    NavbarFuncionarioComponent
  ],
  templateUrl: './efetuar-orcamento.component.html',
  styleUrls: ['./efetuar-orcamento.component.css']
})
export class EfetuarOrcamentoComponent implements OnInit {
  solicitacao!: Solicitacao;
  cliente!: Cliente;
  form!: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private solicitacaoSvc: SolicitacaoService,
    private clienteSvc: ClienteService,
    private funcSvc: FuncionarioService
  ) {}

  ngOnInit(): void {
    const dataHoraParam = this.route.snapshot.paramMap.get('dataHora');
    if (!dataHoraParam) {
      this.router.navigate(['/paginainicialfuncionario']);
      return;
    }

    // Busca a solicitação de forma assíncrona
    this.solicitacaoSvc.buscarSolicitacaoPorDataHora(dataHoraParam)
      .subscribe({
        next: sol => {
          if (!sol) {
            this.router.navigate(['/paginainicialfuncionario']);
            return;
          }
          this.solicitacao = sol;
          // Busca o cliente
          this.clienteSvc.buscarPorcpf(sol.cpfCliente)
            .subscribe({
              next: c => {
                if (!c) {
                  this.router.navigate(['/paginainicialfuncionario']);
                  return;
                }
                this.cliente = c;
                this.initForm();
              },
              error: err => {
                console.error('Erro ao buscar cliente:', err);
                this.router.navigate(['/paginainicialfuncionario']);
              }
            });
        },
        error: err => {
          console.error('Erro ao buscar solicitação:', err);
          this.router.navigate(['/paginainicialfuncionario']);
        }
      });
  }

  private initForm(): void {
    this.form = this.fb.group({
      valor:      [null, [Validators.required, Validators.min(0.01)]],
      observacoes:[ '' ]
    });
  }

  salvar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { valor, observacoes } = this.form.value;
    const funcionarioId = this.funcSvc.dataNascimentoLogado;

    // Prepara atualização
    this.solicitacao.valorOrcamento       = valor;
    this.solicitacao.observacoesOrcamento = observacoes;
    this.solicitacao.dataHoraOrcamento    = new Date().toISOString();
    this.solicitacao.idFuncionario        = funcionarioId;
    this.solicitacao.estado               = 'Orçada';

    // Persiste via serviço e espera callback
    this.solicitacaoSvc.registrarOrcamento(
      this.solicitacao.dataHora,
      valor,
      observacoes,
      funcionarioId
    ).subscribe({
      next: () => this.router.navigate(['/paginainicialfuncionario']),
      error: err => {
        console.error('Erro ao registrar orçamento:', err);
        alert('Falha ao salvar orçamento. Tente novamente.');
      }
    });
  }

  cancelar(): void {
    this.router.navigate(['/paginainicialfuncionario']);
  }
}
