package com.example.digitallibrary.service;

import com.example.digitallibrary.model.User;
import com.example.digitallibrary.repository.BorrowRecordRepository;
import com.example.digitallibrary.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional; // Import nou

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final BorrowRecordRepository borrowRecordRepository; // <--- Nou
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, BorrowRecordRepository borrowRecordRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.borrowRecordRepository = borrowRecordRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User registerUser(User user) {
        if (userRepository.existsByUsername(user.getUsername())) {
            throw new RuntimeException("Username already exists!");
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        if (user.getRole() == null || user.getRole().isEmpty()) {
            user.setRole("ROLE_USER");
        }
        return userRepository.save(user);
    }

    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public List<User> findAllUsers() {
        return userRepository.findAll();
    }

    // --- METODE NOI PENTRU ADMIN ---

    public User updateUser(Long id, User userDetails) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setUsername(userDetails.getUsername());
        user.setRole(userDetails.getRole());

        // Schimbam parola DOAR daca adminul a scris ceva nou.
        // Daca campul e gol, pastram parola veche.
        if (userDetails.getPassword() != null && !userDetails.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(userDetails.getPassword()));
        }

        return userRepository.save(user);
    }

    @Transactional
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 1. Verificam daca are carti nere-turnate
        boolean hasActiveLoans = borrowRecordRepository.findByUserAndStatus(user, com.example.digitallibrary.model.BorrowRecord.BorrowStatus.BORROWED).size() > 0;

        if (hasActiveLoans) {
            throw new RuntimeException("Cannot delete user! They still have unreturned books.");
        }

        // 2. Stergem istoricul vechi al userului (ca sa nu dea eroare baza de date)
        List<com.example.digitallibrary.model.BorrowRecord> history = borrowRecordRepository.findByUser(user);
        borrowRecordRepository.deleteAll(history);

        // 3. Stergem userul
        userRepository.delete(user);
    }
}