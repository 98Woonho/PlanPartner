package com.example.todolist.controller;

import com.example.todolist.domain.dto.EmailAuthDto;
import com.example.todolist.service.UserService;
import jakarta.mail.MessagingException;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.security.NoSuchAlgorithmException;

@Controller
@Slf4j
@RequestMapping("user")
public class UserController {
    @Autowired
    private UserService userService;

    @GetMapping("login")
    public void getLogin() {

    }

    @GetMapping("join")
    public void getJoin() {

    }

    @PostMapping("join")
    public void postJoin(String email) {

    }

    @PostMapping("sendEmail")
    @ResponseBody
    public String postSendEmail(EmailAuthDto emailAuthDto) throws NoSuchAlgorithmException, MessagingException {
        String result = userService.sendEmail(emailAuthDto);

        JSONObject responseObject = new JSONObject();

        responseObject.put("result", result);
        if (result.equals("SUCCESS")) {
            responseObject.put("salt", emailAuthDto.getSalt());
        }

        return responseObject.toString();
    }

    @PatchMapping("sendEmail")
    @ResponseBody
    public String patchSendMail(EmailAuthDto emailAuthDto) {
        return this.userService.verifyCode(emailAuthDto);
    }
}
