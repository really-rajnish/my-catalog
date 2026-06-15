package auth.repository;

import auth.model.LoginActivity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface LoginActivityRepository extends JpaRepository<LoginActivity, Long> {
    List<LoginActivity> findByUserIdOrderByLoginTimeDesc(Long userId);
    List<LoginActivity> findAllByOrderByLoginTimeDesc();
}
