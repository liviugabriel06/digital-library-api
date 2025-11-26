package com.example.digitallibrary.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Entity
@Data
@NoArgsConstructor
public class BorrowRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "book_id", nullable = false)
    private Book book;

    @Column(nullable = false)
    private LocalDate borrowDate;

    private LocalDate returnDate; // Poate fi null daca nu e returnata

    @Enumerated(EnumType.STRING)
    private BorrowStatus status;

    // Definim enum-ul direct aici sau intr-un fisier separat.
    // Il punem aici pentru simplitate momentan.
    public enum BorrowStatus {
        BORROWED,
        RETURNED
    }
}