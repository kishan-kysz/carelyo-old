package com.carelyo.v1.service.topup;

import com.carelyo.v1.dto.topup.AccountInformationDTO;
import com.carelyo.v1.dto.topup.TopUpDTO;
import com.carelyo.v1.dto.topup.TopUpVerifyDTO;
import com.carelyo.v1.dto.topup.UnverifiedTopUpDTO;
import com.carelyo.v1.model.topup.TopUp;
import com.carelyo.v1.model.user.User;
import com.carelyo.v1.model.wallet.ETransactionType;
import com.carelyo.v1.model.wallet.Transaction;
import com.carelyo.v1.model.wallet.Wallet;
import com.carelyo.v1.repos.topup.TopUpRepository;
import com.carelyo.v1.repos.user.UserRepository;
import com.carelyo.v1.service.wallet.WalletService;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;


@Service
public class TopUpService {

  TopUpRepository topUpRepository;

  WalletService walletService;
  UserRepository userRepository;


  public TopUpService(TopUpRepository topUpRepository, WalletService walletService,
      UserRepository userRepository) {

    this.topUpRepository = topUpRepository;
    this.walletService = walletService;
    this.userRepository = userRepository;
  }



  public TopUp createTopUp(TopUpDTO schema, Long userId) {
    User foundUser = userRepository.getOne(userId);

    TopUp topUp = new TopUp();
    topUp.setUserId(foundUser.getId());
    topUp.setEmail(foundUser.getEmail());
    topUp.setReference(schema.getReference());
    topUp.setName(schema.getName());
    topUp.setIsValid(false);
    topUp.setAmountPaid(schema.getAmountPaid());
    topUp.setBank(schema.getBank());
    topUp.setAccountNumber(schema.getAccountNumber());
    return topUpRepository.save(topUp);
  }

  public Set<TopUp> getUnverifiedTopUps() {
    // Hämta unverifierade TopUps från databasen
    // Konvertera till UnverifiedTopUpDTO och returnera
    return topUpRepository.findByIsValid(false);
  }

  public TopUp getUnverifiedTopUpById(Long topUpId) {
    TopUp topup = topUpRepository.findByIdAndIsValid(topUpId, false)
        .orElseThrow(() -> new RuntimeException("TopUp not found"));
    System.out.println("top up " + topup);
    return topup;

  }

  public List<TopUp> getUnverifiedTopUpByUserId(Long userId) {
    List<TopUp> topUp = topUpRepository.findByUserIdAndIsValid(userId,false);
    if (topUp.isEmpty()) {
      System.out.println("TopUp not found for user " + userId);
    }
   return topUp;


  }

  public List<TopUp> getUnverifiedTopUpByEmail(String email) {
    List<TopUp> topUp = topUpRepository.findByEmailAndIsValid(email, false);
    if(topUp.isEmpty()) {
      System.out.println("No top up found for email " + email);
    }
    return topUp;
  }

  private Transaction createTransaction(Double amountPaid) {
    Transaction transaction = new Transaction();
    transaction.setType(ETransactionType.CREDIT);
    transaction.setAmount(amountPaid);
    return transaction;
  }

  public void verifyTopUp(TopUpVerifyDTO topUpDto) {
    // Find the top-up by ID
    TopUp topUp = topUpRepository.findById(topUpDto.getId())
        .orElseThrow(() -> new RuntimeException("TopUp not found"));

    // Verify the top-up
    topUp.setIsValid(true);
    topUpRepository.save(topUp);

    // Get the ID of the top-up creator
    Long topUpCreatorId = topUp.getUserId();

    // Get the wallet of the top-up creator
    Wallet wallet = walletService.getWalletByPatientId(topUpCreatorId);

    // Update the wallet balance based on the amount paid
    Double amountPaid = topUpDto.getAmountPaid();
    Transaction transaction = createTransaction(amountPaid);
    walletService.addTransactionToWallet(wallet, transaction);
  }


}