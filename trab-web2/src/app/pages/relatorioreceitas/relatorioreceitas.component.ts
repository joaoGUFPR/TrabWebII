// src/app/pages/relatorioreceitas/relatorioreceitas.component.ts
import { Component, OnInit } from '@angular/core';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { SolicitacaoService } from '../../services/soliciticao.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarFuncionarioComponent } from '../navbarfuncionario/navbarfuncionario.component';
import { Solicitacao } from '../../shared/models/solicitacao';

interface ReceitaPorDia {
  data: string;
  total: number;
}

interface ReceitaPorCategoria {
  categoria: string;
  total: number;
}

@Component({
  selector: 'app-relatorioreceitas',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarFuncionarioComponent],
  templateUrl: './relatorioreceitas.component.html',
  styleUrls: ['./relatorioreceitas.component.css']
})
export class RelatorioreceitasComponent implements OnInit {
  dataInicial: string | null = null;
  dataFinal: string | null = null;
  receitasPorDia: ReceitaPorDia[] = [];
  receitasPorCategoria: ReceitaPorCategoria[] = [];

  constructor(private solicitacaoService: SolicitacaoService) {}

  ngOnInit(): void {
    this.atualizarRelatorio();
  }

  atualizarRelatorio(): void {
    this.solicitacaoService.listarTodos().subscribe({
      next: (todas: Solicitacao[]) => {
        // 1) filtrar só as pagas e no período, se houver dataInicial/dataFinal
        const filtradas = todas.filter(s => {
          if (!s.dataHoraPagamento) return false;
          const d = new Date(s.dataHoraPagamento);
          if (this.dataInicial) {
            const ini = new Date(`${this.dataInicial}T00:00:00`);
            if (d < ini) return false;
          }
          if (this.dataFinal) {
            const fim = new Date(`${this.dataFinal}T23:59:59.999`);
            if (d > fim) return false;
          }
          return true;
        });

        // 2) agrupar por dia sobre 'filtradas'
        const mapaDia = new Map<string, number>();
        filtradas.forEach(s => {
          const dia = new Date(s.dataHoraPagamento!).toLocaleDateString('pt-BR');
          mapaDia.set(dia, (mapaDia.get(dia) || 0) + (s.valorOrcamento || 0));
        });
        this.receitasPorDia = Array.from(mapaDia.entries())
          .map(([data, total]) => ({ data, total }))
          .sort((a, b) => {
            const da = a.data.split('/').reverse().join('-');
            const db = b.data.split('/').reverse().join('-');
            return new Date(da).getTime() - new Date(db).getTime();
          });

        // 3) agrupar por categoria também sobre 'filtradas'
        const mapaCat = new Map<string, number>();
        filtradas.forEach(s => {
          const cat = s.categoriaEquipamento || '—';
          mapaCat.set(cat, (mapaCat.get(cat) || 0) + (s.valorOrcamento || 0));
        });
        this.receitasPorCategoria = Array.from(mapaCat.entries())
          .map(([categoria, total]) => ({ categoria, total }))
          .sort((a, b) => a.categoria.localeCompare(b.categoria));
      },
      error: err => {
        console.error('Erro ao carregar solicitações para relatório', err);
        this.receitasPorDia = [];
        this.receitasPorCategoria = [];
      }
    });
  }

  gerarPDFDiario(): void {
    const body = this.receitasPorDia.map(r => [ r.data, r.total.toFixed(2) ]);
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Relatório de Receitas por Dia', 14, 20);
    autoTable(doc, {
      startY: 30,
      head: [['Data', 'Total (R$)']],
      body
    });
    doc.save('relatorio-receitas-dia.pdf');
  }

  gerarPDFCategoria(): void {
    const body = this.receitasPorCategoria.map(r => [ r.categoria, r.total.toFixed(2) ]);
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Relatório de Receitas por Categoria (Período Selecionado)', 14, 20);
    autoTable(doc, {
      startY: 30,
      head: [['Categoria', 'Receita (R$)']],
      body
    });
    doc.save('relatorio-receitas-categoria.pdf');
  }
}
