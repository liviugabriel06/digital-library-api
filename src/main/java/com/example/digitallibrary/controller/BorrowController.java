package com.example.digitallibrary.controller;

import com.example.digitallibrary.model.BorrowRecord;
import com.example.digitallibrary.service.BorrowService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/borrow")
public class BorrowController {

    private final BorrowService borrowService;

    public BorrowController(BorrowService borrowService) {
        this.borrowService = borrowService;
    }

    // POST /borrow/5 -> Userul logat imprumuta cartea cu ID 5
    @PostMapping("/{bookId}")
    public ResponseEntity<BorrowRecord> borrowBook(@PathVariable Long bookId, Authentication authentication) {
        String username = authentication.getName(); // Luam username-ul celui logat
        return ResponseEntity.ok(borrowService.borrowBook(bookId, username));
    }

    // PUT /borrow/return/10 -> Returneaza imprumutul cu ID 10
    @PutMapping("/return/{borrowId}")
    public ResponseEntity<BorrowRecord> returnBook(@PathVariable Long borrowId) {
        return ResponseEntity.ok(borrowService.returnBook(borrowId));
    }

    // GET /borrow/my-history -> Istoricul userului logat
    @GetMapping("/my-history")
    public List<BorrowRecord> getMyHistory(Authentication authentication) {
        return borrowService.getUserHistory(authentication.getName());
    }

    // GET /borrow/my-active -> Doar ce are acum acasa
    @GetMapping("/my-active")
    public List<BorrowRecord> getMyActiveLoans(Authentication authentication) {
        return borrowService.getUserActiveLoans(authentication.getName());
    }
}