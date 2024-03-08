package com.example.todolist.service;

import com.example.todolist.domain.dto.EmailAuthDto;
import com.example.todolist.domain.dto.ScheduleDto;
import com.example.todolist.domain.dto.UserDto;
import com.example.todolist.domain.entity.EmailAuth;
import com.example.todolist.domain.entity.Schedule;
import com.example.todolist.domain.entity.User;
import com.example.todolist.domain.repository.EmailAuthRepository;
import com.example.todolist.domain.repository.ScheduleRepository;
import com.example.todolist.domain.repository.UserRepository;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import jakarta.servlet.http.HttpSession;
import org.apache.commons.lang3.RandomStringUtils;
import org.apache.commons.lang3.time.DateUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import java.math.BigInteger;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Date;
import java.util.List;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailAuthRepository emailAuthRepository;

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private SpringTemplateEngine templateEngine;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private ScheduleRepository scheduleRepository;

    @Transactional(rollbackFor = Exception.class)
    public String sendEmail(EmailAuthDto emailAuthDto) throws NoSuchAlgorithmException, MessagingException {
        if (userRepository.existsById(emailAuthDto.getEmail())) {
            return "FAILURE_DUPLICATE_EMAIL";
        }

        String code = RandomStringUtils.randomNumeric(6);
        emailAuthDto.setCode(code);
        emailAuthDto.setCreatedAt(new Date());
        emailAuthDto.setExpiresAt(DateUtils.addMinutes(emailAuthDto.getCreatedAt(), 5)); // 이메일을 보내고 난 뒤 5분 후의 시간
        emailAuthDto.setVerified(false);

        String saltInput = String.format("%s%s%f%f",
                emailAuthDto.getEmail(),
                code,
                Math.random(),
                Math.random());

        MessageDigest md = MessageDigest.getInstance("SHA-512");
        md.reset();
        md.update(saltInput.getBytes(StandardCharsets.UTF_8));

        String salt = String.format("%0128x", new BigInteger(1, md.digest()));

        emailAuthDto.setSalt(salt);

        Context context = new Context();
        context.setVariable("emailAuthDto", emailAuthDto);

        String textHtml = templateEngine.process("user/joinEmail.html", context);

        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper mimemessageHelper = new MimeMessageHelper(message, false);
        mimemessageHelper.setTo(emailAuthDto.getEmail());
        mimemessageHelper.setSubject("[PlanPartner] 회원가입 인증번호");
        mimemessageHelper.setText(textHtml, true);
        mailSender.send(message);

        EmailAuth emailAuth = EmailAuthDto.emailAuthDtoToEntity(emailAuthDto);

        emailAuthRepository.save(emailAuth);

        return "SUCCESS";
    }

    @Transactional(rollbackFor = Exception.class)
    public String verifyCode(EmailAuthDto emailAuthDto) {
        EmailAuth emailAuth = emailAuthRepository.findByEmailAndCodeAndSalt(emailAuthDto.getEmail(), emailAuthDto.getCode(), emailAuthDto.getSalt());

        if (emailAuth == null) {
            return "FAILURE_INVALID_CODE";
        }

        if (new Date().compareTo(emailAuth.getExpiresAt()) > 0) {
            return "FAILURE_EXPIRED";
        }

        emailAuth.setIsVerified(true);

        emailAuthRepository.save(emailAuth);

        return "SUCCESS";
    }

    @Transactional(rollbackFor = Exception.class)
    public void join(UserDto userDto) {
        userDto.setPassword(passwordEncoder.encode(userDto.getPassword()));

        User user = User.builder()
                .email(userDto.getEmail())
                .name(userDto.getName())
                .password(userDto.getPassword())
                .build();

        userRepository.save(user);
    }

    @Transactional(rollbackFor = Exception.class)
    public String login(HttpSession session, UserDto userDto) {
        if (!userRepository.existsById(userDto.getEmail())) {
            return "NOT_FOUND";
        }

        User user = userRepository.findById(userDto.getEmail()).get();

        if (!passwordEncoder.matches(userDto.getPassword(), user.getPassword())) {
            return "NOT_FOUND";
        }

        session.setAttribute("user", user);

        return "SUCCESS";
    }

    public List<Schedule> getScheduleList(User user) {

        return scheduleRepository.findAllByUserEmail(user.getEmail());
    }

    @Transactional(rollbackFor = Exception.class)
    public String addSchedule(User user, ScheduleDto scheduleDto) {
        Schedule schedule = Schedule.builder()
                .title(scheduleDto.getTitle())
                .startDate(scheduleDto.getStartDate())
                .endDate(scheduleDto.getEndDate())
                .startTime(scheduleDto.getStartTime() != null ? scheduleDto.getStartTime() : "")
                .endTime(scheduleDto.getEndTime() != null ? scheduleDto.getEndTime() : "")
                .user(user)
                .build();

        scheduleRepository.save(schedule);

        return "SUCCESS";
    }

    @Transactional(rollbackFor = Exception.class)
    public String modifySchedule(User user, ScheduleDto scheduleDto) {
        Schedule schedule = scheduleRepository.findById(scheduleDto.getId()).get();

        if(!schedule.getUser().getEmail().equals(user.getEmail())) {
            return "ACCOUNT_MISMATCH";
        }

        schedule.setStartDate(scheduleDto.getStartDate());
        schedule.setStartTime(scheduleDto.getStartTime());
        schedule.setEndDate(scheduleDto.getEndDate());
        schedule.setEndTime(scheduleDto.getEndTime());
        schedule.setTitle(scheduleDto.getTitle());

        scheduleRepository.save(schedule);

        return "SUCCESS";
    }

    @Transactional(rollbackFor = Exception.class)
    public String deleteSchedule(User user, Long id) {
        Schedule schedule = scheduleRepository.findById(id).get();

        if(!schedule.getUser().getEmail().equals(user.getEmail())) {
            return "ACCOUNT_MISMATCH";
        }

        scheduleRepository.deleteById(id);

        return "SUCCESS";
    }
}
