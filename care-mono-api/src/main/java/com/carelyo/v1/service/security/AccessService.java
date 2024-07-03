package com.carelyo.v1.service.security;


import com.carelyo.v1.enums.EConsultationStatus;
import com.carelyo.v1.model.role.ERole;
import com.carelyo.v1.model.user.doctor.Doctor;
import com.carelyo.v1.model.user.patient.Patient;
import com.carelyo.v1.service.security.services.UserDetailsImpl;
import java.lang.reflect.Field;
import java.util.Arrays;
import javax.persistence.EntityManager;
import org.springframework.stereotype.Service;

@Service
public class AccessService {

  private final EntityManager em;

  public AccessService(EntityManager em) {
    this.em = em;
  }

  /**
   * Tries to find the userId in an object and compares it with the userId in userDetails
   *
   * @param targetId    Long - id of the entity that is being requested
   * @param entityType  Class - Class of the entity being requested
   * @param userDetails UserDetailsImp associated with jwt
   * @return boolean
   */
  public boolean accessByUserId(Long targetId, Class<?> entityType, UserDetailsImpl userDetails) {
    Object entity = em.find(entityType, targetId);
    if (entity != null) {
      try {
        Field field = entity.getClass().getDeclaredField("userId");
        field.setAccessible(true);
        Long userId = (Long) field.get(entity);
        if (userDetails.getId().equals(userId)) {
          return true;
        }
      } catch (Exception e) {
        System.out.println(e.getMessage());
      }
    }
    return false;
  }

  /**
   * Tries to find the userId in an object and compares it with the userId in userDetails
   *
   * @param userId      Long - id of the entity that is being requested
   * @param userDetails UserDetailsImp associated with jwt
   * @return boolean
   */
  public boolean accessByUserId(Long userId, UserDetailsImpl userDetails) {

    return userDetails.getId().equals(userId);
  }

  /**
   * Checks if userDetails.getAuthorities() contains anny authority also present in roles
   *
   * @param userDetails UserDetailsImp associated with jwt
   * @param roles       ERole
   * @return boolean
   */
  public boolean accessByRole(UserDetailsImpl userDetails, ERole[] roles) {

    return userDetails.getAuthorities().stream()
        .anyMatch(
            a -> Arrays.stream(roles).anyMatch(r -> a.getAuthority().equals(r.name())));
  }

  public boolean checkUserAuthorization(String type, Long id, UserDetailsImpl userDetails) {
    if (type.equals("userId")) {
      if (accessByUserId(id, userDetails)) {
        return true;
      }
    }
    if (accessByUserId(id, Patient.class, userDetails)) {
      return true;
    }
    return accessByUserId(id, Doctor.class, userDetails);
  }


  public boolean hasActiveConsultation(Long doctorId) {
    return em.createQuery(
            "select count(c) from Consultation c where c.doctor.id = :doctorId and c.status = :status",
            Long.class)
        .setParameter("doctorId", doctorId)
        .setParameter("status", EConsultationStatus.started)
        .getSingleResult() > 0;
  }
}