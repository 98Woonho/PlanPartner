package com.example.todolist.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain config(HttpSecurity http) throws Exception {

        //CSRF 비활성화
        http.csrf(
                (config) -> {
                    config.disable();
                }
        );

        //요청 URL별 접근 제한
        http.authorizeHttpRequests(
                authorize -> {
                    authorize.requestMatchers("/**").permitAll();
                    authorize.anyRequest().authenticated();
                }
        );
        //로그인
        http.formLogin(login -> {
            login.permitAll();
            login.loginPage("/user/login");

        });

        //로그아웃
        http.logout(
                (logout) -> {
                    logout.permitAll();
                    logout.logoutUrl("/logout");
                }
        );

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

}
