package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import com.example.demo.model.Employee;
import com.example.demo.repository.EmployeeRepository;

@RestController
public class EmployeeController {

    @Autowired
    private EmployeeRepository repo;

    @GetMapping("/add")
    public String add() {
        Employee e1 = new Employee();
        e1.setName("Harini");

        Employee e2 = new Employee();
        e2.setName("Anu");

        repo.save(e1);
        repo.save(e2);

        return "Data Added ✅";
    }

    @GetMapping("/get")
    public List<Employee> getAll() {
        return repo.findAll();
    }
}
