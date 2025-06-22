package com.trabweb.trabwebspring.model;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "tb_solicitacao")
public class Solicitacao {

    @Id
    @Column(name = "data_hora", length = 50)
    private String dataHora;

    @Column(name = "descricao_equipamento", columnDefinition = "TEXT", nullable = false)
    private String descricaoEquipamento;

    @Column(name = "categoria_equipamento", length = 100, nullable = false)
    private String categoriaEquipamento;

    @Column(name = "descricao_defeito", columnDefinition = "TEXT", nullable = false)
    private String descricaoDefeito;

    @Column(length = 50, nullable = false)
    private String estado;

    @Column(name = "cpf_cliente", length = 11, nullable = false)
    private String cpfCliente;

    @Column(name = "id_funcionario", length = 50)
    private String idFuncionario;

    // trocado para BigDecimal para suportar precision/scale SQL
    @Column(name = "valor_orcamento", precision = 12, scale = 2)
    private BigDecimal valorOrcamento;

    @Column(name = "data_hora_orcamento", length = 50)
    private String dataHoraOrcamento;

    @Column(name = "funcionario_orc_id", length = 50)
    private String funcionarioOrcamentoId;

    @Column(name = "observacoes_orcamento", columnDefinition = "TEXT")
    private String observacoesOrcamento;

    @Column(name = "descricao_manutencao", columnDefinition = "TEXT")
    private String descricaoManutencao;

    @Column(name = "orientacao_cliente", columnDefinition = "TEXT")
    private String orientacaoCliente;

    @Column(name = "horario_aprovacao", length = 50)
    private String horarioAprovacao;

    @Column(name = "data_hora_manutencao", length = 50)
    private String dataHoraManutencao;

    @Column(name = "data_hora_redireciona", length = 50)
    private String dataHoraRedirecionada;

    @Column(name = "data_hora_finalizada", length = 50)
    private String dataHoraFinalizada;

    @Column(name = "data_hora_pagamento", length = 50)
    private String dataHoraPagamento;

    public Solicitacao() {}

    // getters & setters

    public String getDataHora() {
        return dataHora;
    }
    public void setDataHora(String dataHora) {
        this.dataHora = dataHora;
    }

    public String getDescricaoEquipamento() {
        return descricaoEquipamento;
    }
    public void setDescricaoEquipamento(String descricaoEquipamento) {
        this.descricaoEquipamento = descricaoEquipamento;
    }

    public String getCategoriaEquipamento() {
        return categoriaEquipamento;
    }
    public void setCategoriaEquipamento(String categoriaEquipamento) {
        this.categoriaEquipamento = categoriaEquipamento;
    }

    public String getDescricaoDefeito() {
        return descricaoDefeito;
    }
    public void setDescricaoDefeito(String descricaoDefeito) {
        this.descricaoDefeito = descricaoDefeito;
    }

    public String getEstado() {
        return estado;
    }
    public void setEstado(String estado) {
        this.estado = estado;
    }

    public String getCpfCliente() {
        return cpfCliente;
    }
    public void setCpfCliente(String cpfCliente) {
        this.cpfCliente = cpfCliente;
    }

    public String getIdFuncionario() {
        return idFuncionario;
    }
    public void setIdFuncionario(String idFuncionario) {
        this.idFuncionario = idFuncionario;
    }

    public BigDecimal getValorOrcamento() {
        return valorOrcamento;
    }
    public void setValorOrcamento(BigDecimal valorOrcamento) {
        this.valorOrcamento = valorOrcamento;
    }

    public String getDataHoraOrcamento() {
        return dataHoraOrcamento;
    }
    public void setDataHoraOrcamento(String dataHoraOrcamento) {
        this.dataHoraOrcamento = dataHoraOrcamento;
    }

    public String getFuncionarioOrcamentoId() {
        return funcionarioOrcamentoId;
    }
    public void setFuncionarioOrcamentoId(String funcionarioOrcamentoId) {
        this.funcionarioOrcamentoId = funcionarioOrcamentoId;
    }

    public String getObservacoesOrcamento() {
        return observacoesOrcamento;
    }
    public void setObservacoesOrcamento(String observacoesOrcamento) {
        this.observacoesOrcamento = observacoesOrcamento;
    }

    public String getDescricaoManutencao() {
        return descricaoManutencao;
    }
    public void setDescricaoManutencao(String descricaoManutencao) {
        this.descricaoManutencao = descricaoManutencao;
    }

    public String getOrientacaoCliente() {
        return orientacaoCliente;
    }
    public void setOrientacaoCliente(String orientacaoCliente) {
        this.orientacaoCliente = orientacaoCliente;
    }

    public String getHorarioAprovacao() {
        return horarioAprovacao;
    }
    public void setHorarioAprovacao(String horarioAprovacao) {
        this.horarioAprovacao = horarioAprovacao;
    }

    public String getDataHoraManutencao() {
        return dataHoraManutencao;
    }
    public void setDataHoraManutencao(String dataHoraManutencao) {
        this.dataHoraManutencao = dataHoraManutencao;
    }

    public String getDataHoraRedirecionada() {
        return dataHoraRedirecionada;
    }
    public void setDataHoraRedirecionada(String dataHoraRedirecionada) {
        this.dataHoraRedirecionada = dataHoraRedirecionada;
    }

    public String getDataHoraFinalizada() {
        return dataHoraFinalizada;
    }
    public void setDataHoraFinalizada(String dataHoraFinalizada) {
        this.dataHoraFinalizada = dataHoraFinalizada;
    }

    public String getDataHoraPagamento() {
        return dataHoraPagamento;
    }
    public void setDataHoraPagamento(String dataHoraPagamento) {
        this.dataHoraPagamento = dataHoraPagamento;
    }
}
