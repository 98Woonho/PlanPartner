package com.example.todolist.domain.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.Table;
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
    private Long index;
    private String title;
    private String startDate;
    private String endDate;
    private String startTime;
    private String endTime;
}
