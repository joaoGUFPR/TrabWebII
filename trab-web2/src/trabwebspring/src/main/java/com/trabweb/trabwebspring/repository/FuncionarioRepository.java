// src/main/java/com/trabweb/trabwebspring/repository/FuncionarioRepository.java
package com.trabweb.trabwebspring.repository;

import com.trabweb.trabwebspring.model.Funcionario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.Optional;

public interface FuncionarioRepository extends JpaRepository<Funcionario, Long> {
    Optional<Funcionario> findByEmailAndSenha(String email, String senha);
    Optional<Funcionario> findByDataNascimento(LocalDate dataNascimento);
}
