package com.bank.customerservice.controller;

import org.springframework.web.bind.annotation.*;
import java.util.*;
import com.bank.customerservice.security.JwtUtil;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @GetMapping("/login")
    public Map<String, String> login(@RequestParam String username,
                                     @RequestParam String password) {

        Map<String, String> res = new HashMap<>();

        String role;

        if ("admin".equals(username) && "1234".equals(password)) {
            role = "ADMIN";
        } 
        else if ("user".equals(username) && "1234".equals(password)) {
            role = "USER";
        } 
        else {
            res.put("message", "Invalid credentials");
            return res;
        }

        String token = JwtUtil.generateToken(username, role);
        res.put("token", token);

        return res;
    }
}