package com.hirehub.jobportal.repository;

import com.hirehub.jobportal.entity.Interview;
import com.hirehub.jobportal.entity.enums.InterviewStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface InterviewRepository extends JpaRepository<Interview, Long> {
    Page<Interview> findByApplicantId(Long applicantId, Pageable pageable);
    Page<Interview> findByRecruiterId(Long recruiterId, Pageable pageable);
    List<Interview> findByApplicantIdAndInterviewDateAfterAndStatus(Long applicantId, LocalDateTime now, InterviewStatus status);
    List<Interview> findByRecruiterIdAndInterviewDateAfterAndStatus(Long recruiterId, LocalDateTime now, InterviewStatus status);
    long countByRecruiterId(Long recruiterId);
}
