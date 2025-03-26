package com.ij11.chatbot.repositories;

import com.ij11.chatbot.models.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
}
