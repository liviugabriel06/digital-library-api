package com.example.digitallibrary.config;

import com.example.digitallibrary.service.CustomUserDetailsService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final CustomUserDetailsService userDetailsService;

    public SecurityConfig(CustomUserDetailsService userDetailsService) {
        this.userDetailsService = userDetailsService;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable) // Dezactivam CSRF pentru a putea folosi Postman usor
                .authorizeHttpRequests(auth -> auth
                        // 1. Toata lumea are voie sa se inregistreze/logheze
                        .requestMatchers("/auth/**").permitAll()

                        // 2. Toata lumea poate vedea cartile (GET)
                        .requestMatchers(HttpMethod.GET, "/books/**").permitAll()

                        // 3. Doar ADMIN poate adauga/modifica/sterge carti
                        .requestMatchers(HttpMethod.POST, "/books/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/books/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/books/**").hasRole("ADMIN")

                        // 4. Doar USER (si Admin) pot face imprumuturi
                        .requestMatchers("/borrow/**").hasAnyRole("USER", "ADMIN")

                        // Orice altceva cere autentificare
                        .anyRequest().authenticated()
                )
                .httpBasic(Customizer.withDefaults()); // Folosim Basic Auth (fereastra de login simpla in browser / Auth header in Postman)

        return http.build();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService); // Ii spunem sa foloseasca serviciul nostru
        provider.setPasswordEncoder(passwordEncoder());     // Si encoder-ul nostru
        return provider;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(); // Asta cripteaza parolele
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}