package com.example.digitallibrary.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "users") // 'user' e cuvant rezervat in Postgres, folosim 'users'
@Data // Lombok genereaza Getters, Setters, toString, etc.
@NoArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    private String password;

    // Simplificam rolurile: stocam direct String "ADMIN" sau "USER"
    // E mai simplu pentru Basic Auth decat o tabela separata
    @Column(nullable = false)
    private String role;
}