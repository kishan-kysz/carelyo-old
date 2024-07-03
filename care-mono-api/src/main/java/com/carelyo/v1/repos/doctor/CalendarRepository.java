package com.carelyo.v1.repos.doctor;

import com.carelyo.v1.model.user.doctor.Calendar;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CalendarRepository extends JpaRepository<Calendar, Long> {

  List<Calendar> findAllByDoctorId(Long id);

}
