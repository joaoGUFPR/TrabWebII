// login.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ClienteService } from '../../services/cliente.service';
import { FuncionarioService } from '../../services/funcionario.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

interface UserDTO {
  tipo: 'cliente' | 'funcionario';
  id: number;
  email: string;
  nome: string;
  extra: string; // cpf ou dataNascimento
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email = '';
  senha = '';

  private loginUrl = 'http://localhost:8080/login';
  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private router: Router,
    private clienteService: ClienteService,
    private funcionarioService: FuncionarioService,
    private http: HttpClient
  ) {}

  logar(): void {
    this.postLogin(this.email, this.senha)
      .subscribe({
        next: (user: UserDTO) => {
          if (user.tipo === 'funcionario') {
            // rota de funcionário
            this.funcionarioService.idLogado = user.extra;
            this.router.navigate(['/paginainicialfuncionario']);
          } else {
            // rota de cliente
            this.clienteService.cpfLogado = user.extra;
            this.router.navigate(['/paginainicialcliente']);
          }
        },
        error: err => {
          console.error('Erro no login', err);
          alert(err.status === 401
            ? 'Email ou senha inválidos!'
            : 'Não foi possível realizar o login. Tente novamente mais tarde.');
        }
      });
  }

  private postLogin(email: string, senha: string): Observable<UserDTO> {
    return this.http.post<UserDTO>(
      this.loginUrl,
      JSON.stringify({ login: email, senha }),
      this.httpOptions
    ).pipe(
      map(resp => resp), // assume 200 + body
      catchError(err => throwError(() => err))
    );
  }

  irParaCadastro(): void {
    this.router.navigate(['/autocadastro']);
  }
}
