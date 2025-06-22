// src/app/services/equipamento.service.ts
import { Injectable } from '@angular/core';
import { Equipamento } from '../shared/models/equipamento';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class EquipamentoService {
  readonly BASE = 'http://localhost:8080/equipamentos';
  httpOpts = {
    observe: 'response' as const,
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) {}

  listarTodos(): Observable<Equipamento[]> {
    return this.http.get<Equipamento[]>(this.BASE, this.httpOpts).pipe(
      map(resp => resp.status === 200 ? resp.body || [] : []),
      catchError(err => err.status === 404 ? of([]) : throwError(() => err))
    );
  }

  inserir(eq: Equipamento): Observable<Equipamento | null> {
    return this.http.post<Equipamento>(this.BASE, JSON.stringify(eq), this.httpOpts).pipe(
      map(resp => resp.status === 200 ? resp.body : null),
      catchError(err => throwError(() => err))
    );
  }

  buscar(categoria: string): Observable<Equipamento | null> {
    return this.http.get<Equipamento>(`${this.BASE}/${categoria}`, this.httpOpts).pipe(
      map(resp => resp.status === 200 ? resp.body : null),
      catchError(err => err.status === 404 ? of(null) : throwError(() => err))
    );
  }

  atualizar(orig: string, eq: Equipamento): Observable<Equipamento | null> {
    return this.http.put<Equipamento>(
      `${this.BASE}/${orig}`, JSON.stringify(eq), this.httpOpts
    ).pipe(
      map(resp => resp.status === 200 ? resp.body : null),
      catchError(err => throwError(() => err))
    );
  }

  remover(categoria: string): Observable<void> {
    return this.http.delete<void>(`${this.BASE}/${categoria}`, this.httpOpts).pipe(
      map(() => undefined),
      catchError(err => throwError(() => err))
    );
  }
}
