import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { FuncionarioService } from '../../services/funcionario.service';


@Component({
  selector: 'app-navbarfuncionario',
  standalone: true,
  imports: [RouterLink, RouterModule, CommonModule],
  templateUrl: './navbarfuncionario.component.html',
  styleUrl: './navbarfuncionario.component.css'
})
export class NavbarFuncionarioComponent {
  constructor(
    private router: Router,
    private funcService: FuncionarioService
  ) {}

  onLogout(): void {
    this.funcService.logout();
    this.router.navigate(['/login']);
  }
}
