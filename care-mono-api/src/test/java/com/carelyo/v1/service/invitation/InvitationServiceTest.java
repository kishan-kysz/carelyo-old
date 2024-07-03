//package com.carelyo.v1.service.invitation;
//
//import com.carelyo.v1.dto.invitation.InvitationDTO;
//import com.carelyo.v1.dto.invitation.InvitationEmailDTO;
//import com.carelyo.v1.dto.invitation.InvitationFormDTO;
//import com.carelyo.v1.model.invitation.Invitation;
//import com.carelyo.v1.model.user.User;
//import com.carelyo.v1.repos.invitation.InvitationRepository;
//import com.carelyo.v1.repos.user.PatientRepository;
//import com.carelyo.v1.repos.user.UserRepository;
//import com.carelyo.v1.service.security.services.UserDetailsImpl;
//import org.junit.jupiter.api.BeforeEach;
//import org.junit.jupiter.api.Test;
//import org.junit.jupiter.api.extension.ExtendWith;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
//import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
//import org.springframework.test.context.TestPropertySource;
//import org.springframework.test.context.junit.jupiter.SpringExtension;
//
//import static org.junit.jupiter.api.Assertions.*;
//
//@ExtendWith(SpringExtension.class)
//@DataJpaTest
//@TestPropertySource(locations = "classpath:application-test.properties")
//class InvitationServiceTest {
//
//    @Autowired
//    TestEntityManager testEntityManager;
//
//    @Autowired
//    InvitationRepository invitationRepository;
//
//    @Autowired
//    UserRepository userRepository;
//
//    @Autowired
//    PatientRepository patientRepository;
//
//    static InvitationService invitationService;
//
//
//    @BeforeEach
//    void setUp() {
//        invitationService = new InvitationService(invitationRepository, userRepository, patientRepository);
//    }
//
//    @Test
//    void createInvitation() {
//        User user = new User("user@email.com", "password", "0707070077", null);
//        testEntityManager.persist(user);
//        UserDetailsImpl userDetails = new UserDetailsImpl(user.getId(), user.getEmail(),
//                user.getMobile(),
//                user.getPassword(), null, null, "", 1L);
//
//        InvitationFormDTO invitationFormDTO = new InvitationFormDTO("patient@patient.se",
//                "Patient");
//
//        Invitation invitation = invitationService.createInvitation(invitationFormDTO.getEmail(), userDetails);
//        assertEquals("patient@patient.se", invitation.getEmail());
//
//    }
//
////    @Test
////    void getAllInvitations() {
////        Invitation invitationOne = new Invitation();
////        testEntityManager.persist(invitationOne);
////        Invitation invitationTwo = new Invitation();
////        testEntityManager.persist(invitationTwo);
////
////        List<InvitationDTO> invitedUsers = invitationService.getAllInvitations();
////        assertEquals(2, invitedUsers.size());
////    }
//
////    @Test
////    void deleteInvitation() {
////        Invitation invitationOne = new Invitation();
////        testEntityManager.persist(invitationOne);
////        Invitation invitationTwo = new Invitation();
////        testEntityManager.persist(invitationTwo);
////
////        invitationService.deleteInvitation(invitationTwo.getId());
////        List<InvitationDTO> invitedUsers = invitationService.getAllInvitations();
////        assertEquals(1, invitedUsers.size());
////    }
//
////    @Test
////    void getInvitation() {
////        Invitation invitation = new Invitation();
////        testEntityManager.persist(invitation);
////        invitation.setName("Patient");
////        Invitation invitation1 = invitationService.getInvitation(invitation.getId());
////
////        assertEquals("Patient", invitation1.getName());
////    }
//
//    @Test
//    void getInvitationByEmail() {
//        Invitation invitation = new Invitation();
//        testEntityManager.persist(invitation);
//        invitation.setEmail("patient@patient.se");
//        InvitationEmailDTO invitationEmailDTO = new InvitationEmailDTO("Patient",
//                "patient@patient.se");
//        Invitation invitation1 = invitationService.getInvitationByEmail(invitation.getEmail());
//
//        assertEquals("patient@patient.se", invitation1.getEmail());
//    }
//
//    @Test
//    void sendInvitation() {
//        Invitation invitation = new Invitation();
//        invitation.setEmail("patient@patient.se");
//        testEntityManager.persist(invitation);
//
//        InvitationDTO invitationDTO = invitationService.sendInvitation(invitation.getId(), "link")
//                .getFullDTO();
//        assertEquals("patient@patient.se", invitationDTO.getEmail());
//    }
//
////    @Test
////    void sendConfirmation() {
////        User user = new User();
////        user.setEmail("user@user.se");
////        user.setMobile("123456");
////        testEntityManager.persist(user);
////
////        String user1 = invitedUserService.sendConfirmation(user.getId());
////        assertEquals("user@user.se", user1);
////    }
//}