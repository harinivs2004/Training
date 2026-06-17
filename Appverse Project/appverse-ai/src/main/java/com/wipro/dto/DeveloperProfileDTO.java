package com.wipro.dto;
 
import jakarta.validation.constraints.*;
 
public class DeveloperProfileDTO {
 
    private Long id;
 
    @NotBlank(message = "Company name is required")
    @Size(min = 2, max = 100, message = "Company name must be between 2 and 100 characters")
    private String companyName;
 
    private String website;
 
    @Size(max = 300, message = "Bio cannot exceed 300 characters")
    private String bio;
 
    @NotNull(message = "User ID is required")
    private Long userId;
 
    public DeveloperProfileDTO() {}
 
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
 
    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }
 
    public String getWebsite() { return website; }
    public void setWebsite(String website) { this.website = website; }
 
    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }
 
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
}