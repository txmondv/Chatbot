package com.ij11.chatbot.domain.repositories;

import com.ij11.chatbot.domain.models.chat.Chat;
import com.ij11.chatbot.domain.models.users.User;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import java.util.List;
import java.util.Optional;

public interface ChatRepository extends CrudRepository<Chat, Long> {
    List<Chat> findByUser(User user);

    @Query("SELECT MAX(c.id) FROM Chat c")
    Optional<Long> findMaxId();
}
