package com.carelyo.v1.repos.template;

import com.carelyo.v1.enums.ETemplateTypes;
import com.carelyo.v1.model.template.Template;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TemplateRepository extends JpaRepository<Template, Long> {

  Optional<Template> findByTemplateType(ETemplateTypes templateType);
}
