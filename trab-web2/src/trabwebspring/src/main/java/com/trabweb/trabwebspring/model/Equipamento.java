package com.trabweb.trabwebspring.model;

import jakarta.persistence.*;

@Entity
@Table(name = "tb_equipamento")
public class Equipamento {

    @Id
    @Column(name = "categoria_equipamento", nullable = false, unique = true)
    private String categoria;

    public Equipamento() {}

    public Equipamento(String categoria) {
        this.categoria = categoria;
    }

    public String getCategoria() {
        return categoria;
    }

    public void setCategoria(String categoria) {
        this.categoria = categoria;
    }
}
