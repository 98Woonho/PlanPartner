package com.example.todolist.domain.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
@Entity
@IdClass(EmailAuthId.class)
@Table(name="email_auths")
public class EmailAuth {
    @Id
    private String email;
    @Id
    private String code;
    @Id
    private String salt;
    private Date createdAt;
    private Date expiresAt;
    private Boolean isVerified;

}

