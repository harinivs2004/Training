package com.ecommerce.controller;

import com.ecommerce.dto.ProductDTO;
import com.ecommerce.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/products")
public class ProductController {

    private final ProductService service;

    public ProductController(ProductService service) {
        this.service = service;
    }

    @PostMapping
    public ProductDTO addProduct(@Valid @RequestBody ProductDTO dto) {
        return service.save(dto);
    }

    @GetMapping
    public List<ProductDTO> getAllProducts() {
        return service.getAll();
    }
}