import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule }   from '@angular/forms';
import { NavbarFuncionarioComponent } from '../navbarfuncionario/navbarfuncionario.component';
import { Funcionario }           from '../../shared/models/funcionario';
import { FuncionarioService }    from '../../services/funcionario.service';

@Component({
  selector: 'app-cadastrofuncionario',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarFuncionarioComponent],
  templateUrl: './cadastrofuncionario.component.html',
  styleUrls: ['./cadastrofuncionario.component.css']
})
export class CadastrofuncionarioComponent implements OnInit {
  funcionarios: Funcionario[]       = [];
  funcionarioSelecionado: Funcionario | null = null;
  funcionario: Funcionario          = new Funcionario('', '', '', '', 'funcionario');
  exibirFormAtualizacao            = false;
  exibirConfirmacaoRemocao         = false;

  constructor(private funcionarioService: FuncionarioService) {}

  ngOnInit(): void {
    this.refreshList();
  }

  private refreshList(): void {
    this.funcionarioService.listarTodos()
      .subscribe(
        list => this.funcionarios = list,
        err  => console.error('Falha ao listar funcionários', err)
      );
  }

  inserir(): void {
    // dataNascimento já está em "YYYY-MM-DD" pelo <input type="date">
    this.funcionarioService.inserir(this.funcionario).subscribe({
      next: res => {
        if (res) {
          alert('Funcionário cadastrado com sucesso!');
          this.novo();
          this.refreshList();
        }
      },
      error: err => console.error('Erro ao cadastrar funcionário', err)
    });
  }

  selecionar(f: Funcionario): void {
    this.funcionarioSelecionado = { ...f };
    this.exibirFormAtualizacao = false;
    this.exibirConfirmacaoRemocao = false;
  }

  abrirAtualizacao(): void {
    if (this.funcionarioSelecionado) {
      this.exibirFormAtualizacao = true;
    }
  }

  atualizar(): void {
    if (!this.funcionarioSelecionado) return;
    this.funcionarioService.atualizar(this.funcionarioSelecionado).subscribe({
      next: res => {
        if (res) {
          alert('Funcionário atualizado com sucesso!');
          this.novo();
          this.refreshList();
        }
      },
      error: err => console.error('Erro ao atualizar funcionário', err)
    });
  }

  abrirRemocao(): void {
    this.exibirConfirmacaoRemocao = true;
  }

  remover(): void {
    if (!this.funcionarioSelecionado) return;
    this.funcionarioService.remover(this.funcionarioSelecionado.dataNascimento)
      .subscribe({
        next: () => {
          alert('Funcionário removido com sucesso!');
          this.novo();
          this.refreshList();
        },
        error: err => console.error('Erro ao remover funcionário', err)
      });
  }

  novo(): void {
    this.funcionarioSelecionado    = null;
    this.funcionario              = new Funcionario('', '', '', '', 'funcionario');
    this.exibirFormAtualizacao    = false;
    this.exibirConfirmacaoRemocao = false;
  }
}
