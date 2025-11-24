package com.example.digitallibrary.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
public class Book {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String author;

    private String genre;

    private Integer publicationYear; // 'year' e cuvant rezervat in SQL uneori

    @Column(unique = true, nullable = false)
    private String bookNumber;

    private Integer totalCopies;

    private Integer availableCopies;
}