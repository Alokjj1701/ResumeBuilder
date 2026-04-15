package com.resumebuilder.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "templates")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Template {

    @Id
    @Column(length = 50)
    private String id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(columnDefinition = "text")
    private String description;

    @Column(length = 50)
    private String category;

    @Column(columnDefinition = "text")
    private String features;

    @Column(nullable = false)
    @Builder.Default
    private boolean active = true;
}
