package com.trabweb.trabwebspring.rest;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.trabweb.trabwebspring.model.Cliente;
import com.trabweb.trabwebspring.model.Equipamento;
import com.trabweb.trabwebspring.model.Funcionario;
import com.trabweb.trabwebspring.model.Historicosolicitacao;
import com.trabweb.trabwebspring.model.Login;
import com.trabweb.trabwebspring.model.Solicitacao;
import com.trabweb.trabwebspring.model.User;
import com.trabweb.trabwebspring.repository.ClienteRepository;
import com.trabweb.trabwebspring.repository.EquipamentoRepository;
import com.trabweb.trabwebspring.repository.FuncionarioRepository;
import com.trabweb.trabwebspring.repository.HistoricosolicitacaoRepository;
import com.trabweb.trabwebspring.repository.SolicitacaoRepository;

@CrossOrigin(
    origins = "http://localhost:4200",
    methods = {
      RequestMethod.GET,
      RequestMethod.POST,
      RequestMethod.PUT,
      RequestMethod.DELETE,
      RequestMethod.OPTIONS
    }
)
@RestController
public class REST {

    private final ClienteRepository clienteRepo;
    private final FuncionarioRepository funcRepo;
    private final EquipamentoRepository equipamentoRepo;
    private final SolicitacaoRepository solicitacaoRepo;
     private final HistoricosolicitacaoRepository histRepo;


    @Autowired
    public REST(ClienteRepository clienteRepo, FuncionarioRepository funcRepo, EquipamentoRepository equipamentoRepo, SolicitacaoRepository solicitacaoRepo, HistoricosolicitacaoRepository histRepo) {
        this.clienteRepo = clienteRepo;
        this.funcRepo    = funcRepo;
        this.equipamentoRepo = equipamentoRepo;
        this.solicitacaoRepo = solicitacaoRepo;
        this.histRepo = histRepo;
    }

        // Helper para registrar histórico
private void logHistorico(
      Solicitacao s,
      String estado,
      String funcionarioId,
      String observacao
) {
    Historicosolicitacao h = new Historicosolicitacao();
    h.setSolicitacao(s);
    h.setEstado(estado);
    h.setFuncionarioId(funcionarioId);
    h.setObservacao(observacao);
    histRepo.save(h);
}

    private LocalDate parseDate(String s) {
        // dois formatadores: ISO e máscara BR
        DateTimeFormatter isoFmt = DateTimeFormatter.ISO_LOCAL_DATE;            // "yyyy-MM-dd"
        DateTimeFormatter brFmt  = DateTimeFormatter.ofPattern("dd/MM/yyyy");   // "DD/MM/YYYY"
        try {
            return LocalDate.parse(s, isoFmt);
        } catch (DateTimeParseException e1) {
            // se não couber em ISO, tenta BR
            try {
                return LocalDate.parse(s, brFmt);
            } catch (DateTimeParseException e2) {
                throw new IllegalArgumentException("Formato de data inválido: " + s);
            }
        }
    }

    @PostMapping("/login")
    public ResponseEntity<User> login(@RequestBody Login login) {
        // tenta cliente
        Optional<Cliente> cli = clienteRepo.findByEmailAndSenha(login.getLogin(), login.getSenha());
        if (cli.isPresent()) {
            return ResponseEntity.ok(User.fromCliente(cli.get()));
        }
        // tenta funcionário
        Optional<Funcionario> func = funcRepo.findByEmailAndSenha(login.getLogin(), login.getSenha());
        if (func.isPresent()) {
            return ResponseEntity.ok(User.fromFuncionario(func.get()));
        }
        // nenhum dos dois
        return ResponseEntity.status(401).build();
    }

    @PostMapping("/clientes")
        public ResponseEntity<Cliente> criarCliente(@RequestBody Cliente novo) {
        if (clienteRepo.findByCpf(novo.getCpf()).isPresent()) {
            // já existe CPF cadastrado
            return ResponseEntity.badRequest().build();
        }
        Cliente salvo = clienteRepo.save(novo);
        return ResponseEntity.ok(salvo);
    }

        @GetMapping("/clientes")
            public List<Cliente> listarTodos() {
            return clienteRepo.findAll();
    }

        @GetMapping("/solicitacoes/cliente/{cpf}")
    public List<Solicitacao> listarSolicitacoesPorCpf(@PathVariable String cpf) {
        return solicitacaoRepo.findByCpfCliente(cpf);
    }

    @GetMapping("/funcionarios")
    public List<Funcionario> listarFuncionarios() {
        return funcRepo.findAll();
    }

    @PostMapping("/funcionarios")
    public ResponseEntity<Funcionario> criarFuncionario(@RequestBody Funcionario novo) {
        // checar se já existe dataNascimento (ou outro campo único)
        if (funcRepo.findByDataNascimento(novo.getDataNascimento()).isPresent()) {
            return ResponseEntity.badRequest().build();
        }
        Funcionario salvo = funcRepo.save(novo);
        return ResponseEntity.ok(salvo);
    }

// dentro do seu @RestController unificado, sob @RequestMapping("/api")

// LISTAR TODOS
@GetMapping("/equipamentos")
public List<Equipamento> listarEquipamentos() {
    return equipamentoRepo.findAll();
}

// BUSCAR POR CATEGORIA
@GetMapping("/equipamentos/{categoria}")
public ResponseEntity<Equipamento> buscarEquipamento(@PathVariable String categoria) {
    return equipamentoRepo.findById(categoria)
        .map(ResponseEntity::ok)
        .orElse(ResponseEntity.notFound().build());
}

// CRIAR
@PostMapping("/equipamentos")
public ResponseEntity<Equipamento> criarEquipamento(@RequestBody Equipamento novo) {
    if (equipamentoRepo.existsById(novo.getCategoria())) {
        return ResponseEntity.badRequest().build();
    }
    Equipamento salvo = equipamentoRepo.save(novo);
    return ResponseEntity.ok(salvo);
}



// REMOVER
@DeleteMapping("/equipamentos/{categoria}")
public ResponseEntity<Void> removerEquipamento(@PathVariable String categoria) {
    if (!equipamentoRepo.existsById(categoria)) {
        return ResponseEntity.notFound().build();
    }
    equipamentoRepo.deleteById(categoria);
    return ResponseEntity.ok().build();
}

        @GetMapping("/solicitacoes")
    public List<Solicitacao> listarSolicitacoes() {
        return solicitacaoRepo.findAll();
    }

    @GetMapping("/solicitacoes/{dataHora}")
    public ResponseEntity<Solicitacao> buscarSolicitacao(@PathVariable String dataHora) {
        return solicitacaoRepo.findById(dataHora)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/solicitacoes")
    public ResponseEntity<Solicitacao> criarSolicitacao(@RequestBody Solicitacao nova) {
        if (solicitacaoRepo.existsById(nova.getDataHora()))
            return ResponseEntity.badRequest().build();
        Solicitacao salvo = solicitacaoRepo.save(nova);
        logHistorico(salvo, "Aberta", null, null);
        return ResponseEntity.ok(salvo);
    }

    @PutMapping("/solicitacoes/{dataHora}")
    public ResponseEntity<Solicitacao> atualizarSolicitacao(
            @PathVariable String dataHora,
            @RequestBody Solicitacao updated) {
        return solicitacaoRepo.findById(dataHora)
                .map(orig -> {
                    updated.setDataHora(dataHora);
                    Solicitacao salvo = solicitacaoRepo.save(updated);
                    logHistorico(salvo, "Atualizada", null, null);
                    return ResponseEntity.ok(salvo);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Endpoint para registrar orçamento de uma solicitação existente
     */
    @PostMapping("/solicitacoes/{dataHora}/orcamento")
public ResponseEntity<Solicitacao> registrarOrcamento(
        @PathVariable String dataHora,
        @RequestBody Map<String, Object> dto) {
    return solicitacaoRepo.findById(dataHora)
            .map(s -> {
                String funcionarioId = (String) dto.get("funcionarioId");
                s.setValorOrcamento(new BigDecimal(dto.get("valor").toString()));
                s.setObservacoesOrcamento((String) dto.get("observacoes"));
                s.setFuncionarioOrcamentoId(funcionarioId);
                // **garante que o id do orcador fique também em idFuncionario**
                s.setIdFuncionario(funcionarioId);
                s.setDataHoraOrcamento(Instant.now().toString());
                s.setEstado("Orçada");
                Solicitacao salvo = solicitacaoRepo.save(s);

                logHistorico(
                    salvo,
                    "Orçada",
                    funcionarioId,
                    (String) dto.get("observacoes")
                );

                return ResponseEntity.ok(salvo);
            })
            .orElse(ResponseEntity.notFound().build());
}


    @PostMapping("/solicitacoes/{dataHora}/aprovar")
    public ResponseEntity<Solicitacao> aprovarSolicitacao(
            @PathVariable String dataHora,
            @RequestBody Map<String, String> dto) {
        return solicitacaoRepo.findById(dataHora)
            .map(s -> {
                s.setEstado("Aprovada");
                s.setIdFuncionario(dto.get("funcionarioId"));
                s.setOrientacaoCliente(dto.get("observacoes"));
                Solicitacao atualizado = solicitacaoRepo.save(s);
                logHistorico(atualizado, "Aprovada",
                             dto.get("funcionarioId"),
                             dto.get("observacoes"));
                return ResponseEntity.ok(atualizado);
            })
            .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/solicitacoes/{dataHora}/manutencao")
public ResponseEntity<Solicitacao> efetuarManutencao(
        @PathVariable String dataHora,
        @RequestBody Map<String,String> dto) {

    return solicitacaoRepo.findById(dataHora)
      .map(s -> {
          s.setDescricaoManutencao(dto.get("descricaoManutencao"));
          s.setOrientacaoCliente(dto.get("orientacaoCliente"));
          s.setEstado("Arrumada");
          s.setDataHoraManutencao(Instant.now().toString());
          Solicitacao salvo = solicitacaoRepo.save(s);
          logHistorico(salvo, "Arrumada", dto.get("funcionarioId"), null);
          return ResponseEntity.ok(salvo);
      })
      .orElse(ResponseEntity.notFound().build());
}

    @PostMapping("/solicitacoes/{dataHora}/rejeitar")
    public ResponseEntity<Solicitacao> rejeitarSolicitacao(
            @PathVariable String dataHora,
            @RequestBody Map<String, String> dto) {
        return solicitacaoRepo.findById(dataHora)
            .map(s -> {
                s.setEstado("Rejeitada");
                s.setIdFuncionario(dto.get("funcionarioId"));
                s.setOrientacaoCliente(dto.get("observacoes"));
                Solicitacao atualizado = solicitacaoRepo.save(s);
                logHistorico(atualizado, "Rejeitada",
                             dto.get("funcionarioId"),
                             dto.get("observacoes"));
                return ResponseEntity.ok(atualizado);
            })
            .orElse(ResponseEntity.notFound().build());
    }

@GetMapping("/solicitacoes/{dataHora}/historico")
public List<Historicosolicitacao> listarHistorico(
        @PathVariable String dataHora
) {
    return histRepo.findBySolicitacaoDataHora(dataHora);
}

    @PostMapping("/solicitacoes/{dataHora}/pagamento")
    public ResponseEntity<Solicitacao> registrarPagamento(
            @PathVariable String dataHora,
            @RequestBody Map<String, String> dto) {

        return solicitacaoRepo.findById(dataHora)
            .map(s -> {
                // passa para o estado Paga
                s.setEstado("Paga");
                // registra quem pagou (funcionário) e quando
                s.setIdFuncionario(dto.get("funcionarioId"));
                s.setDataHoraPagamento(Instant.now().toString());
                Solicitacao salvo = solicitacaoRepo.save(s);
                // adiciona no histórico
                logHistorico(
                    salvo,
                    "Paga",
                    dto.get("funcionarioId"),
                    dto.getOrDefault("observacoes", null)
                );
                return ResponseEntity.ok(salvo);
            })
            .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/solicitacoes/{dataHora}/finalizar")
public ResponseEntity<Solicitacao> finalizarSolicitacao(
        @PathVariable String dataHora,
        @RequestBody Map<String, String> dto) {

    return solicitacaoRepo.findById(dataHora)
        .map(s -> {
            s.setEstado("Finalizada");
            s.setIdFuncionario(dto.get("funcionarioId"));
            s.setDataHoraFinalizada(Instant.now().toString());
            Solicitacao salvo = solicitacaoRepo.save(s);
            logHistorico(
                salvo,
                "Finalizada",
                dto.get("funcionarioId"),
                dto.getOrDefault("observacoes", null)
            );
            return ResponseEntity.ok(salvo);
        })
        .orElse(ResponseEntity.notFound().build());
}

@PostMapping("/solicitacoes/{dataHora}/resgatar")
public ResponseEntity<Solicitacao> resgatarServico(
        @PathVariable String dataHora,
        @RequestBody Map<String, String> dto) {

    return solicitacaoRepo.findById(dataHora)
        .map(s -> {
            // atualiza estado para Resgatada
            s.setEstado("Aprovada");
            // opcional: registra quem foi o funcionário que entregou 
            s.setDataHoraFinalizada(Instant.now().toString());
            Solicitacao salvo = solicitacaoRepo.save(s);

            // registra no histórico
            logHistorico(
                salvo,
                "Aprovada",
                dto.get("funcionarioId"),
                dto.getOrDefault("observacoes", null)
            );
            return ResponseEntity.ok(salvo);
        })
        .orElse(ResponseEntity.notFound().build());
}

@PutMapping("/equipamentos/{categoria}")
public ResponseEntity<Equipamento> atualizarEquipamento(
        @PathVariable String categoria,
        @RequestBody Equipamento updated) {

    return equipamentoRepo.findById(categoria)
      .map(existing -> {
        // Como a PK é a própria categoria, se ela mudar precisamos
        // apagar o antigo e salvar o novo:
        equipamentoRepo.deleteById(categoria);
        Equipamento salvo = equipamentoRepo.save(updated);
        return ResponseEntity.ok(salvo);
      })
      .orElse(ResponseEntity.notFound().build());
}

    @DeleteMapping("/funcionarios/{dataNascimento}")
    public ResponseEntity<Void> removerFuncionario(@PathVariable String dataNascimento) {
        LocalDate dn = parseDate(dataNascimento);
        // supondo que seu repositório busca por LocalDate:
        Optional<Funcionario> f = funcRepo.findByDataNascimento(dn);
        if (f.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        funcRepo.delete(f.get());
        return ResponseEntity.ok().build();
    }

        @PutMapping("/funcionarios/{dataNascimento}")
    public ResponseEntity<Funcionario> atualizarFuncionario(
            @PathVariable String dataNascimento,
            @RequestBody Funcionario updated) {

        LocalDate dn = parseDate(dataNascimento);
        return funcRepo.findByDataNascimento(dn)
          .map(orig -> {
              // atualiza campos
              orig.setEmail(updated.getEmail());
              orig.setNome(updated.getNome());
              orig.setSenha(updated.getSenha());
              orig.setTipo(updated.getTipo());
              // para dataNascimento no corpo, você também pode parsear:
              orig.setDataNascimento(parseDate(updated.getDataNascimento().toString()));
              Funcionario salvo = funcRepo.save(orig);
              return ResponseEntity.ok(salvo);
          })
          .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/solicitacoes/{dataHora}/redirecionar")
public ResponseEntity<Solicitacao> redirecionarManutencao(
        @PathVariable String dataHora,
        @RequestBody Map<String, String> dto) {

    String novoFuncionarioId = dto.get("novoFuncionarioId");
    if (novoFuncionarioId == null || novoFuncionarioId.isBlank()) {
        return ResponseEntity.badRequest().build();
    }

    return solicitacaoRepo.findById(dataHora)
        .map(s -> {
            // atualiza estado e atribui o novo funcionário
            s.setEstado("Redirecionada");
            s.setIdFuncionario(novoFuncionarioId);
            Solicitacao salvo = solicitacaoRepo.save(s);

            // registra no histórico
            logHistorico(
                salvo,
                "Redirecionada",
                novoFuncionarioId,
                dto.getOrDefault("observacoes", null)
            );

            return ResponseEntity.ok(salvo);
        })
        .orElse(ResponseEntity.notFound().build());
}

}