package com.trabweb.trabwebspring.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "tb_historicosolicitacao")
public class Historicosolicitacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Relação para o pedido original, mas não quero serializar de volta ao cliente */
    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "solicitacao_data_hora", referencedColumnName = "data_hora")
    @JsonIgnore
    private Solicitacao solicitacao;

    /** ISO string de quando o evento aconteceu */
    @Column(name = "data_hora_evento", nullable = false, length = 50)
    private String dataHora;

    @Column(name = "estado", nullable = false, length = 50)
    private String estado;

    @Column(name = "funcionario_id", length = 50)
    private String funcionarioId;

    @Column(name = "observacao", columnDefinition = "TEXT")
    private String observacao;

    public Historicosolicitacao() {}

    @PrePersist
    private void prePersist() {
        this.dataHora = java.time.Instant.now().toString();
    }

    // getters & setters

    public Long getId() { return id; }

    public Solicitacao getSolicitacao() { return solicitacao; }
    public void setSolicitacao(Solicitacao solicitacao) { this.solicitacao = solicitacao; }

    public String getDataHora() { return dataHora; }

    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }

    public String getFuncionarioId() { return funcionarioId; }
    public void setFuncionarioId(String funcionarioId) { this.funcionarioId = funcionarioId; }

    public String getObservacao() { return observacao; }
    public void setObservacao(String observacao) { this.observacao = observacao; }
}
