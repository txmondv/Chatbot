package com.ij11.chatbot.repositories;

import com.ij11.chatbot.models.users.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    Optional<User> findByUsernameIgnoreCase(String username);

    boolean existsByUsername(String username);
    boolean existsByUsernameIgnoreCase(String username);
}
