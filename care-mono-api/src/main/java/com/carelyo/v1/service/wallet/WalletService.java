package com.carelyo.v1.service.wallet;

import com.carelyo.v1.model.wallet.ETransactionType;
import com.carelyo.v1.model.wallet.Transaction;
import com.carelyo.v1.model.wallet.Wallet;
import com.carelyo.v1.repos.wallet.WalletRepository;
import com.carelyo.v1.service.security.services.UserDetailsImpl;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import org.springframework.stereotype.Service;

@Service
public class WalletService {

  private final WalletRepository walletRepository;


  public WalletService(WalletRepository walletRepository) {
    this.walletRepository = walletRepository;

  }

  public void createWallet(long userId) {
    Wallet wallet = new Wallet();
    wallet.setBalance(0.0);
    wallet.setUserId(userId);
    walletRepository.save(wallet);
  }

  public Wallet getWalletByPatientId(Long userId) {
    return walletRepository.findByUserId(userId);
  }

  public Wallet getAuthedUserWallet(UserDetailsImpl userDetails) {
    return walletRepository.findByUserId(userDetails.getId());
  }

  public Double addTransactionToWallet(Wallet wallet, Transaction transaction) {
    double balance = 0;

    List<Transaction> transactions = wallet.getTransactions();
    transactions.add(transaction);
    wallet.setTransactions(transactions);

    if (transaction.getType().equals(ETransactionType.CREDIT)) {
      balance = wallet.getBalance();
      balance -= transaction.getAmount();
      wallet.setBalance(balance);

    } else if (transaction.getType().equals(ETransactionType.DEBIT)) {
      balance = wallet.getBalance();
      balance += transaction.getAmount();
      wallet.setBalance(balance);
    }

    walletRepository.save(wallet);
    return balance;
  }

  public void saveWallet(Wallet wallet) {
    walletRepository.save(wallet);
  }

  @Setter
  @Getter
  @AllArgsConstructor
  public static class BankDetails {
    String accountNo;
    String bankCode;
  }
  public void setBankDetails(BankDetails bDetails , UserDetailsImpl userDetails) {
    Wallet wallet = getAuthedUserWallet(userDetails);
    wallet.setExternalAccount(bDetails.accountNo);
    wallet.setBankCode(bDetails.bankCode);
    walletRepository.save(wallet);
  }

  public void setRecipientRef(String recipientRef, UserDetailsImpl userDetails) {
    Wallet wallet = getAuthedUserWallet(userDetails);
    wallet.setRecipientRef(recipientRef);
    walletRepository.save(wallet);
  }


}
