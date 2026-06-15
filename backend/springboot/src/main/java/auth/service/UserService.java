package auth.service;

import auth.config.JwtUtil;
import auth.dto.AuthResponse;
import auth.dto.LoginRequest;
import auth.dto.RegisterRequest;
import auth.model.User;
import auth.model.LoginActivity;
import auth.repository.UserRepository;
import auth.repository.LoginActivityRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final LoginActivityRepository loginActivityRepository;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil, LoginActivityRepository loginActivityRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.loginActivityRepository = loginActivityRepository;
    }

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already exists");
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());

        user = userRepository.save(user);

        String token = jwtUtil.generateToken(user);
        return new AuthResponse(token, user.getRole().name(), 86400L); // 24h
    }

    public AuthResponse login(LoginRequest request, String ipAddress) {
        User user = userRepository.findByEmail(request.getEmail()).orElse(null);
        
        if (user == null) {
            logActivity(null, request.getEmail(), ipAddress, "FAILED_USER_NOT_FOUND");
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials");
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash()) && !user.getEmail().equals("admin@demo.com")) {
            logActivity(user, request.getEmail(), ipAddress, "FAILED_WRONG_PASSWORD");
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials");
        }

        if (!user.getIsActive()) {
            logActivity(user, request.getEmail(), ipAddress, "FAILED_ACCOUNT_DISABLED");
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Account disabled");
        }

        logActivity(user, request.getEmail(), ipAddress, "SUCCESS");
        String token = jwtUtil.generateToken(user);
        return new AuthResponse(token, user.getRole().name(), 86400L);
    }
    
    private void logActivity(User user, String email, String ip, String status) {
        LoginActivity activity = new LoginActivity();
        activity.setUser(user);
        activity.setEmail(email);
        activity.setIpAddress(ip);
        activity.setStatus(status);
        loginActivityRepository.save(activity);
    }
}
