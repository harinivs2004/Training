package com.bank.customerservice.controller;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/customers")
public class CustomerController {

    @GetMapping
    public String test() {
        return "Customer Service Running";
    }
}