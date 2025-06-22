import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { ClienteService } from '../../services/cliente.service';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterLink, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  cpf = '';

  constructor(
    private router: Router,
    private clienteService: ClienteService
  ) {}

  ngOnInit() {
    this.cpf = this.clienteService.cpfLogado;
  }

  onLogout(): void {
    this.clienteService.logout();
    this.router.navigate(['/login']);
  }
}
