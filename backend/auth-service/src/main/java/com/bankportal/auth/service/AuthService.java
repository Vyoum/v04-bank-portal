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
            // Check if account is locked
            if (isAccountLocked(user)) {
                throw new RuntimeException("Account temporarily locked. Please try again later.");
            }
            
            // Generate and send OTP
            String otp = generateOtp();
            user.setOtpCode(otp);
            user.setOtpExpiry(LocalDateTime.now().plusMinutes(5));
            user.setOtpAttempts(0); // Reset attempts when new OTP is generated
            user.setLastOtpRequest(LocalDateTime.now());
            userRepository.save(user);
            
            // In production, send OTP via email or SMS
            // DO NOT log OTP in production
            // System.out.println("OTP for " + user.getEmail() + ": " + otp);
            
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
     * Verify OTP with rate limiting and account lockout
     */
    public AuthResponse verifyOtp(VerifyOtpRequest request) {
        // Find user by email
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Check if account is locked
        if (isAccountLocked(user)) {
            throw new RuntimeException("Account temporarily locked due to too many failed attempts. Please try again later.");
        }
        
        // Check if OTP exists
        if (user.getOtpCode() == null || user.getOtpExpiry() == null) {
            throw new RuntimeException("No OTP found. Please request a new one.");
        }
        
        // Check if OTP is expired
        if (LocalDateTime.now().isAfter(user.getOtpExpiry())) {
            throw new RuntimeException("OTP has expired. Please request a new one.");
        }
        
        // Verify OTP
        if (!user.getOtpCode().equals(request.getCode())) {
            // Increment failed attempts
            user.setOtpAttempts((user.getOtpAttempts() != null ? user.getOtpAttempts() : 0) + 1);
            
            // Lock account after 3 failed attempts
            if (user.getOtpAttempts() >= 3) {
                user.setOtpLockedUntil(LocalDateTime.now().plusMinutes(15));
                userRepository.save(user);
                throw new RuntimeException("Too many failed attempts. Account locked for 15 minutes.");
            }
            
            userRepository.save(user);
            int remainingAttempts = 3 - user.getOtpAttempts();
            throw new RuntimeException("Invalid OTP code. " + remainingAttempts + " attempt(s) remaining.");
        }
        
        // OTP is valid - reset security fields
        user.setOtpCode(null);
        user.setOtpExpiry(null);
        user.setOtpAttempts(0);
        user.setOtpLockedUntil(null);
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
     * Send OTP to user with cooldown period and security checks
     */
    public AuthResponse sendOtp(String email) {
        // Find user by email
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Check if account is locked
        if (isAccountLocked(user)) {
            throw new RuntimeException("Account temporarily locked. Please try again later.");
        }
        
        // Check cooldown period (60 seconds between OTP requests)
        if (user.getLastOtpRequest() != null) {
            long secondsSinceLastRequest = java.time.Duration.between(
                user.getLastOtpRequest(), 
                LocalDateTime.now()
            ).getSeconds();
            
            if (secondsSinceLastRequest < 60) {
                long remainingSeconds = 60 - secondsSinceLastRequest;
                throw new RuntimeException("Please wait " + remainingSeconds + " seconds before requesting another OTP");
            }
        }
        
        // Generate OTP
        String otp = generateOtp();
        user.setOtpCode(otp);
        user.setOtpExpiry(LocalDateTime.now().plusMinutes(5));
        user.setLastOtpRequest(LocalDateTime.now());
        user.setOtpAttempts(0); // Reset attempts when new OTP is generated
        userRepository.save(user);
        
        // In production, send OTP via email or SMS
        // DO NOT log OTP in production - this is for development only
        // System.out.println("OTP for " + user.getEmail() + ": " + otp);
        
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
     * Check if account is locked due to failed OTP attempts
     */
    private boolean isAccountLocked(User user) {
        if (user.getOtpLockedUntil() == null) {
            return false;
        }
        
        // Check if lock period has expired
        if (LocalDateTime.now().isAfter(user.getOtpLockedUntil())) {
            // Auto-unlock account
            user.setOtpLockedUntil(null);
            user.setOtpAttempts(0);
            userRepository.save(user);
            return false;
        }
        
        return true;
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
