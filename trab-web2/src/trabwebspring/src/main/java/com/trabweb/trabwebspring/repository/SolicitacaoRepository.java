package com.trabweb.trabwebspring.repository;

import com.trabweb.trabwebspring.model.Solicitacao;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SolicitacaoRepository extends JpaRepository<Solicitacao, String> {
    // já existia: findById(dataHora)
    // novo método para filtrar pelo CPF do cliente:
    List<Solicitacao> findByCpfCliente(String cpfCliente);
}
