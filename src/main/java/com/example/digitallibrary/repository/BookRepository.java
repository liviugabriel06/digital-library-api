package com.example.digitallibrary.repository;

import com.example.digitallibrary.model.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface BookRepository extends JpaRepository<Book, Long> {

    // Gaseste cartea dupa codul unic (pentru update/delete admin)
    Optional<Book> findByBookNumber(String bookNumber);

    // Filtrare dupa Autor (case insensitive)
    List<Book> findByAuthorContainingIgnoreCase(String author);

    // Filtrare dupa Gen
    List<Book> findByGenreIgnoreCase(String genre);

    // Filtrare dupa An
    List<Book> findByPublicationYear(Integer year);

    // Cerinta ta: "sa ii apara toate cartile care pot fi imprumutate"
    // Adica unde availableCopies > 0
    List<Book> findByAvailableCopiesGreaterThan(Integer count);
}