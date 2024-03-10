package com.example.todolist.controller;

import com.example.todolist.domain.dto.EmailAuthDto;
import com.example.todolist.domain.dto.ScheduleDto;
import com.example.todolist.domain.dto.UserDto;
import com.example.todolist.domain.entity.Schedule;
import com.example.todolist.domain.entity.User;
import com.example.todolist.service.UserService;
import jakarta.mail.MessagingException;
import jakarta.servlet.http.HttpSession;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.security.NoSuchAlgorithmException;
import java.util.List;

@Controller
@Slf4j
@RequestMapping("user")
public class UserController {
    @Autowired
    private UserService userService;

    @GetMapping("login")
    public void getLogin() {
    }

    @PostMapping("login")
    @ResponseBody
    public String postLogin(HttpSession session, UserDto userDto) {
        return userService.login(session, userDto);
    }

    @GetMapping("logout")
    public String getLogout(HttpSession session) {
        session.setAttribute("user", null);
        return "redirect:/";
    }

    @GetMapping("join")
    public void getJoin() {

    }

    @PostMapping("join")
    public void postJoin(UserDto userDto) {
        userService.join(userDto);
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

    @GetMapping("schedule")
    @ResponseBody
    public List<Schedule> getSchedule(@SessionAttribute(value = "user") User user) {
        return userService.getScheduleList(user);
    }

    @PostMapping("schedule")
    @ResponseBody
    public String postSchedule(@SessionAttribute(value = "user") User user,
                               ScheduleDto scheduleDto) {
        String result = userService.addSchedule(user, scheduleDto);

        return result;
    }

    @PatchMapping("schedule")
    @ResponseBody
    public String patchSchedule(@SessionAttribute(value = "user") User user,
                                ScheduleDto scheduleDto) {
        return userService.modifySchedule(user, scheduleDto);
    }

    @DeleteMapping("schedule")
    @ResponseBody
    public String deleteSchedule(@SessionAttribute(value = "user") User user,
                                 @RequestParam(value = "id") Long id) {
        return userService.deleteSchedule(user, id);
    }
}
