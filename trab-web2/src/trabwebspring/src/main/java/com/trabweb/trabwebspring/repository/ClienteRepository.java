package com.trabweb.trabwebspring.repository;

import com.trabweb.trabwebspring.model.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ClienteRepository extends JpaRepository<Cliente, Long> {
    Optional<Cliente> findByEmailAndSenha(String email, String senha);
    Optional<Cliente> findByCpf(String cpf);
}
