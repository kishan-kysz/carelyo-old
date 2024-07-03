package com.carelyo.v1.repos.support;

import com.carelyo.v1.model.support.SupportInquiry;
import com.carelyo.v1.utils.enums.SupportEnums.SupportStatus;
import java.util.Optional;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InquiriesRepository extends CrudRepository<SupportInquiry, Long> {

  Optional<SupportInquiry> findBySubjectAndIssuerId(String subject, Long issuerId);

  Optional<SupportInquiry> findByMessageAndIssuerId(String message, Long issuerId);

  Slice<SupportInquiry> findAllBySubjectContaining(String subject, Pageable pageable);

  Slice<SupportInquiry> findAllByIssuerId(Long userId, Pageable pageable);

  Slice<SupportInquiry> findAll(Pageable pageable);

  Slice<SupportInquiry> findAllByStatus(SupportStatus status, Pageable pageable);
}
