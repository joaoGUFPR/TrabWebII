// src/main/java/com/trabweb/trabwebspring/model/Funcionario.java
package com.trabweb.trabwebspring.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "tb_funcionario")
public class Funcionario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "email_funcionario", nullable = false, unique = true)
    private String email;

    @Column(name = "senha_funcionario", nullable = false)
    private String senha;

    @Column(name = "nome_funcionario", nullable = false)
    private String nome;

    @Column(name = "tipo", nullable = false)
    private String tipo;

    @Column(name = "data_nascimento", nullable = false)
    private LocalDate dataNascimento;

    public Funcionario() {}

    public Funcionario(String email,
                       String senha,
                       String nome,
                       String tipo,
                       LocalDate dataNascimento) {
        this.email          = email;
        this.senha          = senha;
        this.nome           = nome;
        this.tipo           = tipo;
        this.dataNascimento = dataNascimento;
    }

    // getters & setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getSenha() { return senha; }
    public void setSenha(String senha) { this.senha = senha; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }

    public LocalDate getDataNascimento() { return dataNascimento; }
    public void setDataNascimento(LocalDate dataNascimento) {
        this.dataNascimento = dataNascimento;
    }
}
