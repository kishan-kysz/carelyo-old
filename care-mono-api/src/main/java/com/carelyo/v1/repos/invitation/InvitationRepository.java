package com.carelyo.v1.repos.invitation;

import com.carelyo.v1.model.invitation.Invitation;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InvitationRepository extends JpaRepository<Invitation, Long> {

  Optional<Invitation> findByEmail(String email);

  List<Invitation> findByInvitedById(Long id);

  Optional<Invitation> findByIdAndInvitedById(Long id, Long userId);

  Optional<Invitation> findByEmailAndInvitedById(String email, Long id);
}
