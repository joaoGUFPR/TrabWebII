// cadastroequipamento.component.ts
import { Component, OnInit } from '@angular/core';
import { Equipamento } from '../../shared/models/equipamento';
import { EquipamentoService } from '../../services/equipamento.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarFuncionarioComponent } from "../navbarfuncionario/navbarfuncionario.component";

@Component({
  selector: 'app-cadastroequipamento',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarFuncionarioComponent],
  templateUrl: './cadastroequipamento.component.html',
  styleUrls: ['./cadastroequipamento.component.css']
})
export class CadastroequipamentoComponent implements OnInit {
  equipamentos: Equipamento[] = [];
  equipamentoSelecionado: Equipamento | null = null;
  equipamento: Equipamento = new Equipamento('');
  exibirFormAtualizacao = false;
  exibirConfirmacaoRemocao = false;
  categoriaOriginal = '';
  categoriaParaEdicao = '';

  constructor(private equipamentoService: EquipamentoService) {}

  ngOnInit(): void {
    this.refreshList();
  }

  private refreshList(): void {
    this.equipamentoService.listarTodos().subscribe({
      next: list => this.equipamentos = list,
      error: err => console.error('Falha ao listar equipamentos', err)
    });
  }

  inserir(): void {
    console.log('inserir() chamado, equipamento =', this.equipamento);
    this.equipamentoService.inserir(this.equipamento).subscribe({
      next: res => {
        if (res) {
          alert('Equipamento cadastrado com sucesso');
          this.novo();
          this.refreshList();
        }
      },
      error: err => console.error('Erro ao inserir equipamento', err)
    });
  }

  selecionar(eq: Equipamento): void {
    this.equipamentoSelecionado = { ...eq };
    this.categoriaOriginal = eq.categoria;
    this.categoriaParaEdicao = eq.categoria;
    this.exibirFormAtualizacao = false;
    this.exibirConfirmacaoRemocao = false;
  }

  abrirAtualizacao(): void {
    this.exibirFormAtualizacao = true;
  }

  atualizar(): void {
    if (!this.equipamentoSelecionado) return;
    const updated = new Equipamento(this.categoriaParaEdicao);
    this.equipamentoService.atualizar(this.categoriaOriginal, updated).subscribe({
      next: (res) => {
        if (res) {
          alert('Equipamento atualizado com sucesso');
          this.novo();
          this.refreshList();
        }
      },
      error: err => console.error('Erro ao atualizar equipamento', err)
    });
  }

  abrirRemocao(): void {
    this.exibirConfirmacaoRemocao = true;
  }

  remover(): void {
    if (!this.equipamentoSelecionado) return;
    this.equipamentoService.remover(this.equipamentoSelecionado.categoria).subscribe({
      next: () => {
        alert('Equipamento removido com sucesso');
        this.novo();
        this.refreshList();
      },
      error: err => console.error('Erro ao remover equipamento', err)
    });
  }

  novo(): void {
    this.equipamentoSelecionado = null;
    this.equipamento = new Equipamento('');
    this.exibirFormAtualizacao = false;
    this.exibirConfirmacaoRemocao = false;
  }
}
