package com.carelyo.v1.repos.doctor;

import com.carelyo.v1.model.user.doctor.Accolade;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AccoladeRepository extends JpaRepository<Accolade, Long> {

  List<Accolade> findAllByDoctorId(Long doctorId, Sort sort);

  Optional<Accolade> findByDoctorIdAndId(Long doctorId, Long id);
}
