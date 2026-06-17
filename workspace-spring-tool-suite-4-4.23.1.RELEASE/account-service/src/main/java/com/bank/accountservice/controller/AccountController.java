package com.bank.accountservice.controller;

import org.springframework.web.bind.annotation.*;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;

@RestController
@RequestMapping("/accounts")
public class AccountController {

    @GetMapping
    @CircuitBreaker(name = "accountService", fallbackMethod = "fallbackMethod")
    public String getAccount() {

        
        if (Math.random() > 0.5) {
            throw new RuntimeException("Service Down!");
        }

        return "Account Service Running";
    }


    public String fallbackMethod(Exception ex) {
        return "Service temporarily unavailable. Please try later.";
    }
}