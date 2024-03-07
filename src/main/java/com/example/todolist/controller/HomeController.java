package com.example.todolist.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Controller
public class HomeController {
    @GetMapping("/")
    public String getIndex() {
//        LocalDateTime localDateTime = LocalDateTime.now();
//
//        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss");
//        String formattedDateTime = localDateTime.format(formatter);
//
//        System.out.println(formattedDateTime);
        return "index";
    }

    @GetMapping("calendar")
    public void getCalendar() {

    }
}
