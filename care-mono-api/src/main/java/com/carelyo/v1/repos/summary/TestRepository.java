package com.carelyo.v1.repos.summary;

import com.carelyo.v1.model.summary.Test;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TestRepository extends JpaRepository<Test, Long> {

  Optional<Test> findByCategory(String name);
}
