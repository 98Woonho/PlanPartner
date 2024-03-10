package com.example.todolist.domain.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
@Entity
@Table(name="schedule")
public class Schedule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;
    private String startDate;
    private String endDate;
    private String startTime;
    private String endTime;

    @ManyToOne
    @JoinColumn(name="user_email", foreignKey = @ForeignKey(name="fk_schedule_user_email", foreignKeyDefinition = "FOREIGN KEY(user_email) REFERENCES user(email) ON DELETE CASCADE ON UPDATE CASCADE"))
    private User user;
}
