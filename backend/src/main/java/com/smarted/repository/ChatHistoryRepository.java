package com.smarted.repository;

import com.smarted.entity.ChatHistory;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChatHistoryRepository extends JpaRepository<ChatHistory, Long> {

    List<ChatHistory> findByUserIdOrderByCreatedAtAsc(Long userId);

    void deleteByUserId(Long userId);
}
