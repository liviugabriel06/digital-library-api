package com.example.digitallibrary.repository;

import com.example.digitallibrary.model.BorrowRecord;
import com.example.digitallibrary.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface BorrowRecordRepository extends JpaRepository<BorrowRecord, Long> {

    // 1. Istoricul complet al unui user
    List<BorrowRecord> findByUser(User user);

    // 2. Cartile imprumutate ACTUAL de un user (status = BORROWED)
    List<BorrowRecord> findByUserAndStatus(User user, BorrowRecord.BorrowStatus status);

    // 3. Verificam daca un user are deja cartea X imprumutata si nereturnata
    // (Optional: ca sa nu il lasam sa ia aceeasi carte de 2 ori simultan)
    boolean existsByUserAndBookAndStatus(User user, com.example.digitallibrary.model.Book book, BorrowRecord.BorrowStatus status);
}