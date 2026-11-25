package com.hirehub.jobportal.repository;

import com.hirehub.jobportal.entity.Job;
import com.hirehub.jobportal.entity.enums.EmploymentType;
import com.hirehub.jobportal.entity.enums.ExperienceLevel;
import com.hirehub.jobportal.entity.enums.JobStatus;
import com.hirehub.jobportal.entity.enums.WorkMode;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobRepository extends JpaRepository<Job, Long> {

    Page<Job> findByStatus(JobStatus status, Pageable pageable);

    Page<Job> findByRecruiterId(Long recruiterId, Pageable pageable);

    Page<Job> findByCompanyIdAndStatus(Long companyId, JobStatus status, Pageable pageable);

    @Query("SELECT j FROM Job j WHERE j.status = :status AND (" +
           "(:keyword IS NULL OR LOWER(j.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(j.description) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(j.company.name) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND " +
           "(:location IS NULL OR LOWER(j.location) LIKE LOWER(CONCAT('%', :location, '%'))) AND " +
           "(:workMode IS NULL OR j.workMode = :workMode) AND " +
           "(:employmentType IS NULL OR j.employmentType = :employmentType) AND " +
           "(:experienceLevel IS NULL OR j.experienceLevel = :experienceLevel) AND " +
           "(:category IS NULL OR LOWER(j.category) = LOWER(:category)) AND " +
           "(:minSalary IS NULL OR j.salaryMax >= :minSalary)" +
           ")")
    Page<Job> searchJobs(
            @Param("status") JobStatus status,
            @Param("keyword") String keyword,
            @Param("location") String location,
            @Param("workMode") WorkMode workMode,
            @Param("employmentType") EmploymentType employmentType,
            @Param("experienceLevel") ExperienceLevel experienceLevel,
            @Param("category") String category,
            @Param("minSalary") Double minSalary,
            Pageable pageable
    );

    @Query("SELECT DISTINCT j.category FROM Job j WHERE j.category IS NOT NULL AND j.status = 'PUBLISHED'")
    List<String> findDistinctCategories();

    long countByStatus(JobStatus status);
}
