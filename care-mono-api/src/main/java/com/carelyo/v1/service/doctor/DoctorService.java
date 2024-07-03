package com.carelyo.v1.service.doctor;


import com.carelyo.v1.dto.auth.SignupDTO;
import com.carelyo.v1.dto.doctor.DoctorDTO;
import com.carelyo.v1.dto.doctor.MedicalCertificateDTO.UpdateMedicalCertificate;
import com.carelyo.v1.enums.EDoctorStatus;
import com.carelyo.v1.enums.ESystemStatus;
import com.carelyo.v1.model.provider.Provider;
import com.carelyo.v1.model.user.User;
import com.carelyo.v1.model.user.doctor.Doctor;
import com.carelyo.v1.model.user.doctor.MedicalCertificate;
import com.carelyo.v1.repos.user.DoctorRepository;
import com.carelyo.v1.service.external.MinioAdapter;
import com.carelyo.v1.service.provider.ProviderService;
import com.carelyo.v1.service.user.UserService;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;


@Service
public class DoctorService {

  private final DoctorRepository doctorRepository;
  private final MinioAdapter minioAdapter;
  private final UserService userService;
  private final ProviderService providerService;

  public DoctorService(DoctorRepository doctorRepository,
      MinioAdapter minioAdapter, UserService userService,
      ProviderService providerService) {
    this.doctorRepository = doctorRepository;
    this.minioAdapter = minioAdapter;
    this.userService = userService;
    this.providerService = providerService;
  }

  public List<Doctor> getAllDoctors() {
    return new ArrayList<>(doctorRepository.findAll());
  }

  public Optional<Doctor> getById(Long id) {
    return doctorRepository.findById(id);
  }

  public Doctor getByUserId(Long userId) {
    if (doctorRepository.findByUserId(userId).isPresent()) {
      return doctorRepository.findByUserId(userId).get();
    }
    throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Doctor not found");
  }

  public boolean isDoctor(Long userId) {
    return doctorRepository.findByUserId(userId).isPresent();
  }

  public void saveDoctor(Doctor doctor) {
    doctorRepository.save(doctor);
  }

  public void updateDoctorStatus(Long userId, EDoctorStatus status) {
    Doctor doctor = getByUserId(userId);
    doctorRepository.save(doctor.updateStatus(status));

  }

  public void updateSystemStatus(Long userId, ESystemStatus status) {
    Doctor doctor = getByUserId(userId);
    doctorRepository.save(doctor.updateSystemStatus(status));

  }

  public Optional<Doctor> getDoctorByCertificateNumber(String certificateNumber) {
    if (doctorRepository.findByMedicalCertificate_CertificateNumber(certificateNumber)
        .isPresent()) {
      return doctorRepository.findByMedicalCertificate_CertificateNumber(certificateNumber);
    }
    throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Doctor not found");
  }

  public boolean certificateExist(String certificateNumber) {
    return doctorRepository.findByMedicalCertificate_CertificateNumber(certificateNumber)
        .isPresent();
  }

  public MedicalCertificate updateMDCNCertificate(Long userId,
      UpdateMedicalCertificate dto) {
    if (getDoctorByCertificateNumber(
        dto.getMedicalCertificate().getCertificateNumber()).isPresent()) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
          "Certificate number already exists");
    }
    Doctor doctor = getByUserId(userId);
    MedicalCertificate medicalCertificate = new MedicalCertificate(dto);
    doctor.setMedicalCertificate(medicalCertificate);
    doctorRepository.save(doctor);
    return medicalCertificate;
  }

  public void createDoctor(SignupDTO.DoctorSignupDTO dto, Long userId) {
    Doctor doctor = new Doctor(dto, userId);

    Provider provider = providerService.getSpecificprovider(dto.getProviderId());
    doctor.setProviderName(provider.getProviderName());
    doctor.setProviderId(1L);
    doctorRepository.save(doctor);

  }

  public Doctor updateProfile(DoctorDTO.CompleteProfileDTO updateDTO, Long userId) {
    if (!updateDTO.getConsent()) {
      throw new ResponseStatusException(HttpStatus.FORBIDDEN,
          "You must agree to the terms of service before continuing");
    }
    if (updateDTO.getStudentIdNumber() != null) {
      if (getDoctorByStudentIdNumber(updateDTO.getStudentIdNumber()).isPresent()) {
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
            "Doctor with that Student Identification Number already exists");
      }
    }
    Doctor doctor = getByUserId(userId);
    User user = userService.getUserById(doctor.getUserId());
    user.setConsent(updateDTO.getConsent());
    userService.save(user);
    if (doctor.getAccountStatus() == EDoctorStatus.SUSPENDED) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Doctor is suspended");
    }
    return doctorRepository.save(doctor.completeProfile(updateDTO));
  }

  public Optional<Doctor> getDoctorByNationalIdentificationNumber(
      Long nationalIdentificationNumber) {
    return doctorRepository.findByNationalIdNumber(nationalIdentificationNumber);
  }

  private Optional<Doctor> getDoctorByStudentIdNumber(String studentIdNumber) {
    return doctorRepository.findByStudentIdNumber(studentIdNumber);
  }

  public void updateDoctorNIN(Long userId, Long nationalIdentificationNumber) {
    Doctor doctor = getByUserId(userId);
    if (getDoctorByNationalIdentificationNumber(nationalIdentificationNumber).isPresent()) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
          "Doctor with that National Identification Number already exists");
    }
    doctor.setNationalIdNumber(nationalIdentificationNumber);
    doctorRepository.save(doctor);
  }


  public String updateProfilePicture(Long userId, MultipartFile file) {
    Doctor doctor = getByUserId(userId);
    if (doctor.getAvatar() != null) {
      minioAdapter.removeFile(doctor.getAvatar());
    }
    String filename = doctor.getFirstName().toLowerCase() + userId + Objects.requireNonNull(
        file.getOriginalFilename()).substring(file.getOriginalFilename().lastIndexOf("."));
    try {
      minioAdapter.uploadFile(filename, file.getBytes());
      doctor.setAvatarUrlExpiryDate(System.currentTimeMillis());
      String url = minioAdapter.getSignedUrl(filename);
      doctor.setAvatar(url);
      doctor.setAvatarFileName(filename);
      doctorRepository.save(doctor);
      return url;
    } catch (Exception e) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
    }

  }

  public String getAvatar(Long userId) {
    Doctor doctor = getByUserId(userId);
    Long SEVEN_DAYS_IN_MILLIS = 604800000L;
    if (doctor.getAvatarUrlExpiryDate() == null
        || doctor.getAvatarUrlExpiryDate() + SEVEN_DAYS_IN_MILLIS
        < System.currentTimeMillis()) { // if the doctor has no avatar
      try {
        String url = minioAdapter.getSignedUrl(doctor.getAvatarFileName());
        doctor.setAvatar(url);
        doctor.setAvatarUrlExpiryDate(System.currentTimeMillis());
        doctorRepository.save(doctor);
        return url;
      } catch (Exception e) {
        return null;
      }
    }
    return doctor.getAvatar();
  }

  public void suspendDoctor(Long userId) {

    Doctor doctor = getByUserId(userId);
    doctor.setAccountStatus(EDoctorStatus.SUSPENDED);
    doctorRepository.save(doctor);

  }

  public void reactivateDoctorProfile(Long userId) {
    Doctor doctor = getByUserId(userId);
    doctor.setAccountStatus(EDoctorStatus.ACTIVE);
    doctorRepository.save(doctor);
  }

  public Optional<Doctor> getByNationalIdNumberOrMdcn(Long nationalIdentificationNumber,
      String MDCNCertificateNumber) {
    return doctorRepository.findByNationalIdNumberOrMdcn(nationalIdentificationNumber, MDCNCertificateNumber);
  }

}