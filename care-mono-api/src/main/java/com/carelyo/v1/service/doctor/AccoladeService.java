package com.carelyo.v1.service.doctor;

import com.carelyo.v1.dto.doctor.DoctorDTO;
import com.carelyo.v1.dto.doctor.DoctorDTO.UpdateAccoladeDTO;
import com.carelyo.v1.enums.EAccoladeTypes;
import com.carelyo.v1.model.user.doctor.Accolade;
import com.carelyo.v1.repos.doctor.AccoladeRepository;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AccoladeService {

  private final AccoladeRepository accoladesRepository;

  AccoladeService(AccoladeRepository accoladesRepository) {
    this.accoladesRepository = accoladesRepository;
  }

  public Accolade getAccoladeById(Long id) {
    if (accoladesRepository.findById(id).isPresent()) {
      return accoladesRepository.findById(id).get();
    }
    throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Accolade not found");
  }

  public List<Accolade> getAccoladesByUserId(Long userId) {
    return accoladesRepository.findAllByDoctorId(userId, Sort.by("year").descending());
  }

  public void deleteAccolade(Long id, Long userId) {
    Accolade accolade = getAccoladeById(id);
    if (accolade.getDoctorId().equals(userId)) {
      accoladesRepository.deleteById(id);
    } else {
      throw new ResponseStatusException(HttpStatus.FORBIDDEN,
          "You do not have access to this resource");
    }

  }

  public Accolade addAccolade(Long userId, DoctorDTO.CreateAccoladeDTO accoladeDTO) {
    if (accoladeDTO.getYear() == null) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Year is required");
    }
    try {
      Accolade accolade = new Accolade(userId, accoladeDTO);
      return accoladesRepository.save(accolade);
    } catch (Exception e) {
      if (e.getMessage().contains(
          " Cannot deserialize value of type `com.carelyo.v1.enums.EAccoladeTypes`")) {
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
            "Invalid Accolade name " + ", Must be one of: " + Arrays.toString(
                EAccoladeTypes.values()));
      }
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
    }


  }

  public Accolade updateAccolade(Long doctorId, UpdateAccoladeDTO accoladeDTO) {

    Optional<Accolade> optionalAccolade = accoladesRepository.findByDoctorIdAndId(doctorId,
        accoladeDTO.getId());
    if (optionalAccolade.isEmpty()) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Accolade not found");
    }
    Accolade accolade = optionalAccolade.get();
    accolade.setName(accoladeDTO.getName());
    accolade.setDescription(accoladeDTO.getDescription());
    accolade.setYear(accoladeDTO.getYear());
    return accoladesRepository.save(accolade);
  }
}
