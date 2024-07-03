package com.carelyo.v1.model.user.doctor;

import com.carelyo.v1.dto.auth.SignupDTO;
import com.carelyo.v1.dto.consultation.ConsultationDTO.ActiveConsultationDoctor;
import com.carelyo.v1.dto.doctor.DoctorDTO;
import com.carelyo.v1.dto.doctor.DoctorDTO.CompleteProfileDTO;
import com.carelyo.v1.enums.EDoctorAccountType;
import com.carelyo.v1.enums.EDoctorStatus;
import com.carelyo.v1.enums.ESystemStatus;
import com.carelyo.v1.model.BaseModel;
import java.time.LocalDateTime;
import javax.persistence.Column;
import javax.persistence.Embedded;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Entity
@AllArgsConstructor
@NoArgsConstructor
public class Doctor extends BaseModel {

  // Personal Details
  private Long userId;

  private String firstName;
  private String lastName;
  @Column(unique = true)
  private Long nationalIdNumber;

  private LocalDateTime dateOfBirth;
  private String gender;
  private String university;

  private LocalDateTime graduationDate;
  @Column(unique = true)
  private String studentIdNumber;

  // Contact Details
  private String city;
  private String state;
  private String country;
  private String street;
  private Long streetNumber;
  private Long zipCode;

  // Work Details
  private String hospital;
  private String workAddress;
  private String workEmail;
  private String workMobile;
  private Long providerId;
  private String providerName;
  @Embedded
  private MedicalCertificate medicalCertificate;

  // System Details
  private Long avatarUrlExpiryDate;
  @Column(length = 5000)
  private String avatar;
  private String avatarFileName;
  @Enumerated(EnumType.STRING)
  private EDoctorAccountType accountType;
  @Enumerated(EnumType.STRING)
  private EDoctorStatus accountStatus;
  @Enumerated(EnumType.STRING)
  private ESystemStatus systemStatus;
  private String accountNumber;

  public Doctor(Long userId, String workEmail, String workMobile, String firstName,
      String lastName) {
    this.userId = userId;
    this.firstName = firstName;
    this.lastName = lastName;
    this.workEmail = workEmail;
    this.workMobile = workMobile;
  }

  public Doctor(SignupDTO.DoctorSignupDTO dto, Long userId) {
    this.firstName = dto.getFirstName();
    this.lastName = dto.getLastName();
    this.userId = userId;
    this.hospital = dto.getHospital();
    this.medicalCertificate = dto.getMedicalCertificate();
    this.nationalIdNumber = dto.getNationalIdNumber();
    this.accountStatus = (EDoctorStatus.PENDING);
    this.accountType = (EDoctorAccountType.Doctor);
    this.systemStatus = (ESystemStatus.Offline);
    this.providerId = dto.getProviderId();
  }

  public Doctor updateSystemStatus(ESystemStatus systemStatus) {
    this.systemStatus = systemStatus;
    return this;
  }

  public Doctor updateStatus(EDoctorStatus status) {
    this.accountStatus = status;
    return this;
  }

/*    public Doctor updateAccountType(EDoctorAccountType accountType) {
        this.accountType = accountType;
        return this;
    }*/

  public Doctor completeProfile(CompleteProfileDTO completeProfileDTO) {
    this.setFirstName(completeProfileDTO.getFirstName());
    this.setLastName(completeProfileDTO.getLastName());
    this.setDateOfBirth(completeProfileDTO.getDateOfBirth());
    this.setGender(completeProfileDTO.getGender());
    this.setUniversity(completeProfileDTO.getUniversity());
    this.setGraduationDate(completeProfileDTO.getGraduationDate());
    this.setStudentIdNumber(completeProfileDTO.getStudentIdNumber());
    this.setCity(completeProfileDTO.getCity());
    this.setState(completeProfileDTO.getState());
    this.setCountry(completeProfileDTO.getCountry());
    this.setStreet(completeProfileDTO.getStreet());
    this.setStreetNumber(completeProfileDTO.getStreetNumber());
    this.setZipCode(completeProfileDTO.getZipCode());
    this.setHospital(completeProfileDTO.getHospital());
    this.setWorkAddress(completeProfileDTO.getWorkAddress());
    this.setWorkMobile(completeProfileDTO.getWorkMobile());
    this.setWorkEmail(completeProfileDTO.getWorkEmail());
    this.setAccountStatus(EDoctorStatus.ACTIVE);
    return this;
  }

  public DoctorDTO getDoctorDto(Long id, String mobile, String email, Long referralCount,
      String code, Doctor doctor, String avatar, Double rating) {
    return new DoctorDTO(
        id,
        doctor.getSystemStatus(),
        doctor.getAccountStatus(),
        doctor.getAccountType(),
        doctor.getFirstName(),
        doctor.getLastName(),
        doctor.getGender(),
        doctor.getDateOfBirth(),
        doctor.getUniversity(),
        doctor.getGraduationDate(),
        doctor.getStudentIdNumber(),
        doctor.getNationalIdNumber(),
        doctor.getCity(),
        doctor.getState(),
        doctor.getCountry(),
        doctor.getStreet(),
        doctor.getStreetNumber(),
        doctor.getZipCode(),
        doctor.getHospital(),
        doctor.getWorkAddress(),
        doctor.getWorkEmail(),
        doctor.getWorkMobile(),
        mobile,
        email,
        code,
        referralCount,
        avatar,
        rating);
  }

  public DoctorDTO.Response getDoctorDto(Long id, String mobile, String email, Long referralCount,
      String code, Doctor doctor, String avatar, Double rating,
      ActiveConsultationDoctor activeConsultation, Long providerId) {
    return new DoctorDTO.Response(
        id,
        doctor.getSystemStatus(),
        doctor.getAccountStatus(),
        doctor.getAccountType(),
        doctor.getFirstName(),
        doctor.getLastName(),
        doctor.getGender(),
        doctor.getDateOfBirth(),
        doctor.getUniversity(),
        doctor.getGraduationDate(),
        doctor.getStudentIdNumber(),
        doctor.getNationalIdNumber(),
        doctor.getCity(),
        doctor.getState(),
        doctor.getCountry(),
        doctor.getStreet(),
        doctor.getStreetNumber(),
        doctor.getZipCode(),
        doctor.getHospital(),
        doctor.getWorkAddress(),
        doctor.getWorkEmail(),
        doctor.getWorkMobile(),
        mobile,
        email,
        code,
        referralCount,
        avatar,
        rating,
        activeConsultation, providerId);
  }

}
