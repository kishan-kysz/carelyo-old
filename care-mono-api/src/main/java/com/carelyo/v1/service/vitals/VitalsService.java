package com.carelyo.v1.service.vitals;

import com.carelyo.v1.dto.vitals.VitalsDTO;
import com.carelyo.v1.dto.vitals.VitalsDTO.CreateBloodGlucose;
import com.carelyo.v1.dto.vitals.VitalsDTO.CreateBloodOxygen;
import com.carelyo.v1.dto.vitals.VitalsDTO.CreateBloodPressure;
import com.carelyo.v1.dto.vitals.VitalsDTO.CreateBodyTemperature;
import com.carelyo.v1.dto.vitals.VitalsDTO.CreateHeartRate;
import com.carelyo.v1.dto.vitals.VitalsDTO.CreateMenstruation;
import com.carelyo.v1.dto.vitals.VitalsDTO.CreateRespiratoryRate;
import com.carelyo.v1.dto.vitals.VitalsDTO.CreateVitals;
import com.carelyo.v1.model.role.ERole;
import com.carelyo.v1.model.user.User;
import com.carelyo.v1.service.patient.PatientService;
import com.carelyo.v1.service.security.services.UserDetailsImpl;
import com.carelyo.v1.service.user.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class VitalsService {

  private final BloodGlucoseService bloodGlucoseService;
  private final BloodOxygenService bloodOxygenService;
  private final BloodPressureService bloodPressureService;
  private final BodyTemperatureService bodyTemperatureService;
  private final HeartRateService heartRateService;
  private final MenstruationService menstruationService;
  private final RespiratoryRateService respiratoryRateService;
  private final UserService userService;
  private final PatientService patientService;

  public VitalsService(BloodGlucoseService bloodGlucoseService,
      BloodOxygenService bloodOxygenService, BloodPressureService bloodPressureService,
      BodyTemperatureService bodyTemperatureService, HeartRateService heartRateService,
      MenstruationService menstruationService, RespiratoryRateService respiratoryRateService,
      UserService userService, PatientService patientService) {
    this.bloodGlucoseService = bloodGlucoseService;
    this.bloodOxygenService = bloodOxygenService;
    this.bloodPressureService = bloodPressureService;
    this.bodyTemperatureService = bodyTemperatureService;
    this.heartRateService = heartRateService;
    this.menstruationService = menstruationService;
    this.respiratoryRateService = respiratoryRateService;
    this.userService = userService;
    this.patientService = patientService;
  }

  public boolean isNotAuthorized(Long userId, UserDetailsImpl userDetails) {
    User user = userService.getUserById(userDetails.getId());
    return !user.getRole().getName().equals(ERole.SYSTEMADMIN) &&
        !user.getRole().getName().equals(ERole.DOCTOR) &&
        !user.getId().equals(userId) &&
        !patientService.isChildsParent(userId, userDetails.getId());
  }

  public boolean userDoesNotExist(Long userId) {
    return userService.findById(userId).isEmpty();
  }

  public void createVitalsCheck(Long userId, UserDetailsImpl userDetails) {
    if (isNotAuthorized(userId, userDetails)) {
      throw new ResponseStatusException(HttpStatus.FORBIDDEN,
          "You are not authorized to access this resource");
    }

    if (userDoesNotExist(userId)) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User does not exist");
    }

    if (!patientService.isPatientByUserId(userId)) {
      throw new ResponseStatusException(HttpStatus.FORBIDDEN, "User is not a patient");
    }
  }

  public VitalsDTO getVitalsByUserId(Long userId, UserDetailsImpl userDetails) {
    if (isNotAuthorized(userId, userDetails)) {
      throw new ResponseStatusException(HttpStatus.FORBIDDEN,
          "You are not authorized to access this resource");
    }

    if (userDoesNotExist(userId)) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User does not exist");
    }

    return new VitalsDTO(
        bloodGlucoseService.getAllBloodGlucoseByUserId(userId),
        bloodOxygenService.getAllBloodOxygenByUserId(userId),
        bloodPressureService.getAllBloodPressureByUserId(userId),
        bodyTemperatureService.getAllBodyTemperatureByUserId(userId),
        heartRateService.getAllHeartRateByUserId(userId),
        menstruationService.getAllMenstruationByUserId(userId),
        respiratoryRateService.getAllRespiratoryRateByUserId(userId));
  }

  public VitalsDTO getVitalsByUserIdAndChildId(Long userId, Long childId,
      UserDetailsImpl userDetails) {
    if (isNotAuthorized(userId, userDetails)) {
      throw new ResponseStatusException(HttpStatus.FORBIDDEN,
          "You are not authorized to access this resource");
    }

    if (userDoesNotExist(userId)) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User does not exist");
    }

    return new VitalsDTO(
        bloodGlucoseService.getBloodGlucoseByUserIdAndChildId(userId, childId),
        bloodOxygenService.getAllBloodOxygenByUserIdAndChildId(userId, childId),
        bloodPressureService.getAllBloodPressureByUserIdAndChildId(userId, childId),
        bodyTemperatureService.getAllBodyTemperatureByUserIdAndChildId(userId, childId),
        heartRateService.getAllHeartRateByUserIdAndChildId(userId, childId),
        menstruationService.getAllMenstruationByUserIdAndChildId(userId, childId),
        respiratoryRateService.getAllRespiratoryRateByUserIdAndChildId(userId, childId));
  }

  public VitalsDTO getAllVitals() {
    return new VitalsDTO(
        bloodGlucoseService.getAllBloodGlucose(),
        bloodOxygenService.getAllBloodOxygen(),
        bloodPressureService.getAllBloodPressure(),
        bodyTemperatureService.getAllBodyTemperature(),
        heartRateService.getAllHeartRate(),
        menstruationService.getAllMenstruation(),
        respiratoryRateService.getAllRespiratoryRate());
  }

  public void createVitals(CreateVitals createVitalsDTO, UserDetailsImpl userDetails,
      Long userId, Long childId) {
    if (createVitalsDTO.getBloodGlucose() != null) {
      createBloodGlucose(createVitalsDTO.getBloodGlucose(), userDetails, userId, childId);
    }
    if (createVitalsDTO.getBloodOxygen() != null) {
      createBloodOxygen(createVitalsDTO.getBloodOxygen(), userDetails, userId, childId);
    }
    if (createVitalsDTO.getBloodPressure() != null) {
      createBloodPressure(createVitalsDTO.getBloodPressure(), userDetails, userId, childId);
    }
    if (createVitalsDTO.getBodyTemperature() != null) {
      createBodyTemperature(createVitalsDTO.getBodyTemperature(), userDetails, userId, childId);
    }
    if (createVitalsDTO.getHeartRate() != null) {
      createHeartRate(createVitalsDTO.getHeartRate(), userDetails, userId, childId);
    }
    if (createVitalsDTO.getMenstruation() != null) {
      createMenstruation(createVitalsDTO.getMenstruation(), userDetails, userId, childId);
    }
    if (createVitalsDTO.getRespiratoryRate() != null) {
      createRespiratoryRate(createVitalsDTO.getRespiratoryRate(), userDetails, userId, childId);
    }
  }

  public void createBloodGlucose(CreateBloodGlucose createBloodGlucoseDTO,
      UserDetailsImpl userDetails, Long userId, Long childId) {
    createVitalsCheck(userId, userDetails);

    bloodGlucoseService.createBloodGlucose(createBloodGlucoseDTO, userId, childId);
  }

  public void createBloodOxygen(CreateBloodOxygen createBloodOxygenDTO,
      UserDetailsImpl userDetails, Long userId, Long childId) {
    createVitalsCheck(userId, userDetails);

    bloodOxygenService.createBloodOxygen(createBloodOxygenDTO, userId, childId);
  }

  public void createBloodPressure(CreateBloodPressure createBloodPressureDTO,
      UserDetailsImpl userDetails, Long userId, Long childId) {
    createVitalsCheck(userId, userDetails);

    bloodPressureService.createBloodPressure(createBloodPressureDTO, userId, childId);
  }

  public void createBodyTemperature(CreateBodyTemperature createBodyTemperatureDTO,
      UserDetailsImpl userDetails, Long userId, Long childId) {
    createVitalsCheck(userId, userDetails);

    bodyTemperatureService.createBodyTemperature(createBodyTemperatureDTO, userId, childId);
  }

  public void createHeartRate(CreateHeartRate createHeartRateDTO, UserDetailsImpl userDetails,
      Long userId, Long childId) {
    createVitalsCheck(userId, userDetails);

    heartRateService.createHeartRate(createHeartRateDTO, userId, childId);
  }

  public void createMenstruation(CreateMenstruation createMenstruationDTO,
      UserDetailsImpl userDetails, Long userId, Long childId) {
    createVitalsCheck(userId, userDetails);

    menstruationService.createMenstruation(createMenstruationDTO, userId, childId);
  }

  public void createRespiratoryRate(CreateRespiratoryRate createRespiratoryRateDTO,
      UserDetailsImpl userDetails, Long userId, Long childId) {
    createVitalsCheck(userId, userDetails);

    respiratoryRateService.createRespiratoryRate(createRespiratoryRateDTO, userId, childId);
  }

}
