package com.carelyo.v1.service.wallet;

import com.carelyo.v1.model.wallet.Transaction;
import com.carelyo.v1.repos.wallet.TransactionRepository;
import java.util.Optional;
import org.springframework.stereotype.Service;

@Service
public class TransactionService {

  private final TransactionRepository transactionRepository;

  public TransactionService(TransactionRepository transactionRepository) {
    this.transactionRepository = transactionRepository;
  }

  public Optional<Transaction> getTransactionByRef(String ref) {
    return transactionRepository.findByReference(ref);
  }
}
