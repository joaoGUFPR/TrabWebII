import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { SolicitacaoService } from '../../services/soliciticao.service';
import { ClienteService }      from '../../services/cliente.service';
import { EquipamentoService }  from '../../services/equipamento.service';

import { Solicitacao }          from '../../shared/models/solicitacao';
import { Historicosolicitacao } from '../../shared/models/historicosolicitacao';
import { Equipamento }          from '../../shared/models/equipamento';

import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-solicita-manutencao',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NavbarComponent],
  templateUrl: './solicita-manutencao.component.html',
  styleUrls: ['./solicita-manutencao.component.css']
})
export class SolicitaManutencaoComponent implements OnInit {
  cpf = '';
  descricaoEquipamento = '';
  categoriaEquipamento = '';
  descricaoDefeito = '';
  id = ''; // se necessário, atribua o idLogado aqui
  equipamentos: Equipamento[] = [];

  constructor(
    private router: Router,
    private solicitacaoService: SolicitacaoService,
    private clienteService: ClienteService,
    private equipamentoService: EquipamentoService
  ) {}

  ngOnInit(): void {
    this.cpf = this.clienteService.cpfLogado;
    this.equipamentoService.listarTodos()
      .subscribe(
        list => this.equipamentos = list,
        err  => {
          console.error('Falha ao carregar equipamentos', err);
          this.equipamentos = [];
        }
      );
  }

  enviarSolicitacao(): void {
    const agora = new Date();
    const dataHoraString = agora.toISOString();

    const historicoInicial = new Historicosolicitacao(
      dataHoraString,
      'Aberta',
      this.id,
      'Solicitação criada'
    );

    const novaSolicitacao = new Solicitacao(
      dataHoraString,
      this.descricaoEquipamento,
      this.categoriaEquipamento,
      this.descricaoDefeito,
      'Aberta',
      this.cpf,
      this.id,
      0,
      '',
      '',
      '',
      '',
      '',
      [historicoInicial],
      '',
      '',
      '',
      '',
      ''
    );

    this.solicitacaoService.adicionarSolicitacao(novaSolicitacao);
    console.log('Solicitação adicionada: ', novaSolicitacao);
    this.router.navigate(['/paginainicialcliente']);
  }

}
