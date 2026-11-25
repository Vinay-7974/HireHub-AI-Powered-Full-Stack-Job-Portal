package com.hirehub.jobportal.repository;

import com.hirehub.jobportal.entity.AIAnalysis;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AIAnalysisRepository extends JpaRepository<AIAnalysis, Long> {
    Page<AIAnalysis> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);
    Optional<AIAnalysis> findFirstByUserIdAndAnalysisTypeOrderByCreatedAtDesc(Long userId, String analysisType);
}
