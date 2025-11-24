package com.example.digitallibrary.repository;

import com.example.digitallibrary.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    // Optional inseamna ca poate sa gaseasca userul sau nu (evitam NullPointerException)
    Optional<User> findByUsername(String username);

    // Folositor la inregistrare, sa nu lasam doi useri cu acelasi nume
    boolean existsByUsername(String username);
}