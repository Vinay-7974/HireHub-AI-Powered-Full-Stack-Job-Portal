package com.hirehub.jobportal.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "companies", indexes = {
    @Index(name = "idx_company_name", columnList = "name"),
    @Index(name = "idx_company_industry", columnList = "industry")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Company {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(length = 500)
    private String logo;

    @Column(length = 500)
    private String coverImage;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(length = 200)
    private String website;

    @Column(length = 100)
    private String industry;

    @Column(length = 50)
    private String companySize;

    @Column(length = 150)
    private String location;

    @Column(length = 200)
    private String linkedinUrl;

    @Column(length = 200)
    private String twitterUrl;

    @Column(nullable = false)
    @Builder.Default
    private boolean verified = false;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
