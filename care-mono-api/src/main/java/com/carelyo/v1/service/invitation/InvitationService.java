package com.carelyo.v1.service.invitation;

import com.carelyo.v1.dto.invitation.InvitationDTO.InvitationRequestDTO;
import com.carelyo.v1.model.invitation.Invitation;
import com.carelyo.v1.model.message.MessageComposer;
import com.carelyo.v1.model.message.MessageComposer.CSS;
import com.carelyo.v1.model.template.TplUserInvitation;
import com.carelyo.v1.repos.invitation.InvitationRepository;
import com.carelyo.v1.service.email.thymeleaf_email.component.EmailSenderService;
import com.carelyo.v1.service.email.thymeleaf_email.model.Mail;
import com.carelyo.v1.service.template.TemplateService;
import com.carelyo.v1.utils.enums.EInvitation;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class InvitationService {

  InvitationRepository invitationRepository;
  @Autowired
  EmailSenderService emailSenderService;
  TemplateService templateService;
  @Value("${client.login.url}")
  private String LOGIN_URL;

  public InvitationService(InvitationRepository invitationRepository,
      TemplateService templateService
  ) {
    this.invitationRepository = invitationRepository;

    this.templateService = templateService;
  }

  public Invitation createInvitation(InvitationRequestDTO invitationFormDTO,
      Long userId) {
    Optional<Invitation> optionalInvitation = getInvitationByEmail(
        invitationFormDTO.getEmail());
    if (optionalInvitation.isEmpty()) {
      Invitation invitation = new Invitation(invitationFormDTO.getEmail(),
          invitationFormDTO.getName());
      invitation.setInvitedById(userId);
      invitation.setInvitedByName(invitation.getInvitedByName());
      invitationRepository.save(invitation);

      return invitation;
    }
    throw new ResponseStatusException(HttpStatus.CONFLICT,
        invitationFormDTO.getName() + " has already been invited to carelyo");
  }

  public List<Invitation> getAllInvitations() {
    return new ArrayList<>(invitationRepository.findAll());
  }

  public String deleteInvitation(Long id, Long userId) {
    Optional<Invitation> invitation = getInvitationById(id);
    boolean canDelete =
        invitation.isPresent() && invitation.get().getInvitedById().equals(userId);
    if (canDelete) {
      invitationRepository.deleteById(id);
      return "Invitation deleted";
    } else {
      throw new ResponseStatusException(HttpStatus.FORBIDDEN,
          "You do not have access to perform that action");
    }
  }

  public Optional<Invitation> getInvitationById(Long id) {
    return invitationRepository.findById(id);
  }

  public Optional<Invitation> getInvitationByEmail(String email) {
    return invitationRepository.findByEmail(email);
  }

  public void sendInvitation(Invitation invitation, String code) {
    // Set template variables
    TplUserInvitation tpl = new TplUserInvitation();
    tpl.setLoginLink(LOGIN_URL);
    tpl.setRegisterLink(LOGIN_URL + "/signup?referral=" + code);
    tpl.setReferallCode(code);

    MessageComposer msgComposer = new MessageComposer(tpl);

    // Send a Mail
    Mail mail = new Mail(invitation.getEmail(), tpl.getSubject());
    emailSenderService.sendComposedEmail(msgComposer.createMessage(CSS.MAIL), mail);



    // Update invitation
    invitation.setStatus(EInvitation.sent);
    invitationRepository.save(invitation);
  }

  public void updateInvitationStatus(String email, EInvitation status) {
    Optional<Invitation> optionalInvitation = getInvitationByEmail(email);
    optionalInvitation.ifPresent(invitation -> {
      if (status == EInvitation.registered) {
        invitation.setRegistrationDate(LocalDateTime.now());
      }
      invitation.setStatus(status);
      invitationRepository.save(invitation);
    });

  }

  public List<Invitation> getInvitationByUserId(Long targetId) {
    return invitationRepository.findByInvitedById(targetId);
  }


}
