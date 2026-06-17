package com.wipro.dto;
 
import jakarta.validation.constraints.*;
 
public class CategoryDTO {
 
    private Long id;
 
    @NotBlank(message = "Category name is required")
    @Size(min = 2, max = 50, message = "Name must be between 2 and 50 characters")
    private String name;
 
    @Size(max = 200, message = "Description cannot exceed 200 characters")
    private String description;
 
    public CategoryDTO() {}
 
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
 
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
 
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}