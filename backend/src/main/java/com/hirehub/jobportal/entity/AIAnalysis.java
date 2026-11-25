package com.hirehub.jobportal.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "ai_analyses", indexes = {
    @Index(name = "idx_ai_user", columnList = "user_id"),
    @Index(name = "idx_ai_type", columnList = "analysisType")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AIAnalysis {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 50)
    private String analysisType; // RESUME_ANALYZER, JOB_MATCH, COVER_LETTER, INTERVIEW_PREP, SKILL_GAP

    @Column(columnDefinition = "TEXT")
    private String inputSummary;

    @Column(columnDefinition = "LONGTEXT")
    private String resultJson;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;
}
