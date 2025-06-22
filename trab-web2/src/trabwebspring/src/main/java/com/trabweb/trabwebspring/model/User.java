package com.trabweb.trabwebspring.model;

import java.time.format.DateTimeFormatter;

import com.trabweb.trabwebspring.model.Cliente;
import com.trabweb.trabwebspring.model.Funcionario;

public class User {
    private String tipo;     // "cliente" ou "funcionario"
    private Long id;
    private String email;
    private String nome;
    private String extra;    // ex: cpf para cliente ou dataNascimento para funcionário

    private User() {}

    public static User fromCliente(Cliente c) {
        User dto = new User();
        dto.tipo  = "cliente";
        dto.id    = c.getId();
        dto.email = c.getEmail();
        dto.nome  = c.getNome();
        dto.extra = c.getCpf();
        return dto;
    }

    public static User fromFuncionario(Funcionario f) {
        User dto = new User();
        dto.tipo  = "funcionario";
        dto.id    = f.getId();
        dto.email = f.getEmail();
        dto.nome  = f.getNome();
        dto.extra = f.getDataNascimento().format(DateTimeFormatter.ISO_LOCAL_DATE);
        return dto;
    }

    // getters (e setters se precisar)
    public String getTipo() { return tipo; }
    public Long getId()     { return id; }
    public String getEmail(){ return email; }
    public String getNome() { return nome; }
    public String getExtra(){ return extra; }
}
