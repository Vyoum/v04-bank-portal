package com.bankportal.auth.service;

import com.bankportal.auth.dto.*;
import com.bankportal.auth.model.User;
import com.bankportal.auth.repository.UserRepository;
import de.mkammerer.argon2.Argon2;
import de.mkammerer.argon2.Argon2Factory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class AuthService {
    
    @Autowired
    private UserRepository userRepository;
    
    private final Argon2 argon2 = Argon2Factory.create();
    private final SecureRandom secureRandom = new SecureRandom();
    
    /**
     * Register a new user
     */
    public AuthResponse register(RegisterRequest request) {
        // Check if user already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }
        
        // Validate password strength
        if (request.getPassword().length() < 8) {
            throw new RuntimeException("Password must be at least 8 characters");
        }
        
        // Create new user
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(hashPassword(request.getPassword()));
        user.setRole("user");
        user.setMfaEnabled(false);
        
        // Save user
        user = userRepository.save(user);
        
        // Generate token
        String token = generateToken();
        
        // Convert to DTO
        UserDto userDto = convertToDto(user);
        
        return AuthResponse.builder()
                .token(token)
                .user(userDto)
                .mfaRequired(false)
                .message("Registration successful")
                .build();
    }
    
    /**
     * Login user
     */
    public AuthResponse login(LoginRequest request) {
        // Find user by email
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));
        
        // Verify password
        if (!verifyPassword(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }
        
        // Check if MFA is enabled
        if (user.getMfaEnabled() != null && user.getMfaEnabled()) {
            // Generate and send OTP
            String otp = generateOtp();
            user.setOtpCode(otp);
            user.setOtpExpiry(LocalDateTime.now().plusMinutes(5));
            userRepository.save(user);
            
            // In production, send OTP via email or SMS
            System.out.println("OTP for " + user.getEmail() + ": " + otp);
            
            return AuthResponse.builder()
                    .mfaRequired(true)
                    .message("OTP sent to your registered email/phone")
                    .build();
        }
        
        // Generate token
        String token = generateToken();
        
        // Convert to DTO
        UserDto userDto = convertToDto(user);
        
        return AuthResponse.builder()
                .token(token)
                .user(userDto)
                .mfaRequired(false)
                .message("Login successful")
                .build();
    }
    
    /**
     * Verify OTP
     */
    public AuthResponse verifyOtp(VerifyOtpRequest request) {
        // Find user by email
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Check if OTP is valid
        if (user.getOtpCode() == null || user.getOtpExpiry() == null) {
            throw new RuntimeException("No OTP found. Please request a new one.");
        }
        
        // Check if OTP is expired
        if (LocalDateTime.now().isAfter(user.getOtpExpiry())) {
            throw new RuntimeException("OTP has expired. Please request a new one.");
        }
        
        // Verify OTP
        if (!user.getOtpCode().equals(request.getCode())) {
            throw new RuntimeException("Invalid OTP code");
        }
        
        // Clear OTP
        user.setOtpCode(null);
        user.setOtpExpiry(null);
        userRepository.save(user);
        
        // Generate token
        String token = generateToken();
        
        // Convert to DTO
        UserDto userDto = convertToDto(user);
        
        return AuthResponse.builder()
                .token(token)
                .user(userDto)
                .mfaRequired(false)
                .message("OTP verification successful")
                .build();
    }
    
    /**
     * Send OTP to user
     */
    public AuthResponse sendOtp(String email) {
        // Find user by email
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Generate OTP
        String otp = generateOtp();
        user.setOtpCode(otp);
        user.setOtpExpiry(LocalDateTime.now().plusMinutes(5));
        userRepository.save(user);
        
        // In production, send OTP via email or SMS
        System.out.println("OTP for " + user.getEmail() + ": " + otp);
        
        return AuthResponse.builder()
                .message("OTP sent successfully")
                .build();
    }
    
    /**
     * Hash password using Argon2
     */
    private String hashPassword(String password) {
        return argon2.hash(10, 65536, 1, password.toCharArray());
    }
    
    /**
     * Verify password
     */
    private boolean verifyPassword(String password, String hash) {
        return argon2.verify(hash, password.toCharArray());
    }
    
    /**
     * Generate OTP (6 digits)
     */
    private String generateOtp() {
        int otp = 100000 + secureRandom.nextInt(900000);
        return String.valueOf(otp);
    }
    
    /**
     * Generate authentication token
     */
    private String generateToken() {
        return "token_" + UUID.randomUUID().toString();
    }
    
    /**
     * Convert User entity to UserDto
     */
    private UserDto convertToDto(User user) {
        return UserDto.builder()
                .id("user_" + user.getId())
                .email(user.getEmail())
                .name(user.getName())
                .role(user.getRole())
                .mfaEnabled(user.getMfaEnabled())
                .mfaMethod(user.getMfaMethod())
                .createdAt(user.getCreatedAt() != null ? user.getCreatedAt().toString() : null)
                .build();
    }
}
