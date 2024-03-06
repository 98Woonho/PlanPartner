package com.example.todolist.domain.repository;

import com.example.todolist.domain.entity.EmailAuth;
import com.example.todolist.domain.entity.EmailAuthId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EmailAuthRepository extends JpaRepository<EmailAuth, EmailAuthId> {
    EmailAuth findByEmailAndCodeAndSalt(String email,
                                        String code,
                                        String salt);
}
