package com.trabweb.trabwebspring.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.trabweb.trabwebspring.model.Historicosolicitacao;

public interface HistoricosolicitacaoRepository
        extends JpaRepository<Historicosolicitacao, Long> {

    // busca todos os eventos ligados a uma solicitacao.dataHora
    List<Historicosolicitacao> findBySolicitacaoDataHora(String dataHora);
}
