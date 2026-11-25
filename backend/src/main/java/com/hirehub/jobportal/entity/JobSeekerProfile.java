package com.hirehub.jobportal.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "job_seeker_profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobSeekerProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(length = 200)
    private String headline;

    @Column(columnDefinition = "TEXT")
    private String about;

    @Column(length = 150)
    private String location;

    @Column(length = 100)
    private String preferredRole;

    @Column(length = 150)
    private String preferredLocation;

    private Double expectedSalary;

    @Column(length = 100)
    private String workPreferences; // e.g. "Remote, Full-time"

    @Column(length = 255)
    private String portfolioUrl;

    @Column(length = 255)
    private String linkedInUrl;

    @Column(length = 255)
    private String gitHubUrl;

    @Column(length = 500)
    private String resumeUrl;

    @Column(length = 255)
    private String resumeOriginalName;

    @Column(columnDefinition = "TEXT")
    private String resumeText; // parsed text from uploaded resume for AI ATS parsing

    @Builder.Default
    private Integer profileCompletionPercentage = 20;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "job_seeker_skills", joinColumns = @JoinColumn(name = "profile_id"))
    @Column(name = "skill_name")
    @Builder.Default
    private List<String> skills = new ArrayList<>();

    @OneToMany(mappedBy = "jobSeekerProfile", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Education> educationList = new ArrayList<>();

    @OneToMany(mappedBy = "jobSeekerProfile", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Experience> experienceList = new ArrayList<>();

    @OneToMany(mappedBy = "jobSeekerProfile", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Project> projectList = new ArrayList<>();

    @OneToMany(mappedBy = "jobSeekerProfile", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Certification> certificationList = new ArrayList<>();
}
