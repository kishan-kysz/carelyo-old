package com.carelyo.v1.repos.payout;

import com.carelyo.v1.model.payment.PayOut;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository

public interface PayOutRepository extends JpaRepository<PayOut, Long> {

  /**
   * Payout by serviceId
   */
  Optional<PayOut> findByServiceId
  (long serviceId);

  /**
   * Payroll
   *
   * @param start Start dateTime
   * @param end   End dateTime
   * @return List<PayOut>
   */
  List<PayOut> findAllByOnPayRollIsTrueAndPaidOutIsFalseAndDateOnPayRollBetween
  (LocalDateTime start, LocalDateTime end);

  /**
   * Payroll History
   *
   * @param start Start dateTime
   * @param end   End dateTime
   * @return List<PayOut>
   */
  List<PayOut> findByPaidOutIsTrueAndDatePaidOutBetween
  (LocalDateTime start, LocalDateTime end);

  /**
   * Payslip
   *
   * @param userId Doctors userId
   * @param start  Start DateTime
   * @param end    End DateTime
   * @return List<PayOut>
   */
  List<PayOut> findAllByUserIdAndOnPayRollIsTrueAndOnPaySlipIsTrueAndPaidOutIsFalseAndDateOnPayRollBetween
  (long userId, LocalDateTime start, LocalDateTime end);

  /**
   * Payslip History
   *
   * @param userId Doctors userId
   * @param start  Start DateTime
   * @param end    End DateTime
   * @return List<PayOut>
   */
  List<PayOut> findAllByUserIdAndPaidOutIsTrueAndDatePaidOutBetween
  (long userId, LocalDateTime start, LocalDateTime end);
}
