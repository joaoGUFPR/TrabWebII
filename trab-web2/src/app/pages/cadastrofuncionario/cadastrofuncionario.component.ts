import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm }   from '@angular/forms';
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
  funcionarioParaEdicao: Funcionario = new Funcionario('', '', '', '', 'funcionario');


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

  inserir(form: NgForm): void {
    // dataNascimento já está em "YYYY-MM-DD" pelo <input type="date">
    this.funcionarioService.inserir(this.funcionario).subscribe({
      next: res => {
        if (res) {
          alert('Funcionário cadastrado com sucesso!');
          form.resetForm(); 
          this.novo();
          this.refreshList();
        }
      },
      error: err => console.error('Erro ao cadastrar funcionário', err)
    });
  }

  selecionar(f: Funcionario): void {
    this.funcionarioSelecionado = f;
    // clonamos para edição
    this.funcionarioParaEdicao = { ...f };
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
    this.funcionarioService.atualizar(this.funcionarioParaEdicao).subscribe({
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

    if (!this.podeRemover) {
    alert('Você não pode remover este funcionário.');
    this.novo();
    return;
  }

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

get podeRemover(): boolean {
  if (!this.funcionarioSelecionado) return false;

  const logado = this.funcionarioService.idLogado
  const selecionado = this.funcionarioSelecionado.dataNascimento;

  console.log('>> comparar remoção:', {
    totalFuncionarios: this.funcionarios.length,
    logado,
    selecionado
  });

  return this.funcionarios.length > 1
      && selecionado !== logado;
}
}
