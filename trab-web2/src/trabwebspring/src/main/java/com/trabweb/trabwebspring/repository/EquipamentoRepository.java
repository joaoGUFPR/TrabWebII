package com.trabweb.trabwebspring.repository;

import com.trabweb.trabwebspring.model.Equipamento;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EquipamentoRepository extends JpaRepository<Equipamento, String> {
    // findByCategoria não é mais necessário, JpaRepository já expõe findById(categoria)
}
