package com.hirehub.jobportal.repository;

import com.hirehub.jobportal.entity.JobAlert;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobAlertRepository extends JpaRepository<JobAlert, Long> {
    Page<JobAlert> findByUserId(Long userId, Pageable pageable);
    List<JobAlert> findByActiveTrue();
}
