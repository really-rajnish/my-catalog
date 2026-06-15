package auth.controller;

import auth.model.LoginActivity;
import auth.model.User;
import auth.repository.LoginActivityRepository;
import auth.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final UserRepository userRepository;
    private final LoginActivityRepository loginActivityRepository;

    public AdminController(UserRepository userRepository, LoginActivityRepository loginActivityRepository) {
        this.userRepository = userRepository;
        this.loginActivityRepository = loginActivityRepository;
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        if (!userRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        userRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/logins")
    public ResponseEntity<List<LoginActivity>> getLoginActivities() {
        return ResponseEntity.ok(loginActivityRepository.findAllByOrderByLoginTimeDesc());
    }
}
