package com.bank.customerservice.controller;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/customers")
public class CustomerController {

    @GetMapping("/user")
    public String user() {
        return "User can view ✅";
    }

    @GetMapping("/admin")
    public String admin() {
        return "Admin can modify ✅";
    }
}