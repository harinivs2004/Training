package com.wipro.dto;
 
import jakarta.validation.constraints.*;
 
public class AppDTO {
 
    private Long id;
 
    @NotBlank(message = "App name is required")
    @Size(min = 2, max = 100, message = "App name must be between 2 and 100 characters")
    private String name;
 
    @Size(max = 500, message = "Description cannot exceed 500 characters")
    private String description;
 
    private String iconUrl;
    private Double averageRating;
    private Long totalDownloads;
 
    @NotNull(message = "Developer ID is required")
    private Long developerId;
 
    @NotNull(message = "Category ID is required")
    private Long categoryId;
 
    public AppDTO() {}
 
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
 
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
 
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
 
    public String getIconUrl() { return iconUrl; }
    public void setIconUrl(String iconUrl) { this.iconUrl = iconUrl; }
 
    public Double getAverageRating() { return averageRating; }
    public void setAverageRating(Double averageRating) { this.averageRating = averageRating; }
 
    public Long getTotalDownloads() { return totalDownloads; }
    public void setTotalDownloads(Long totalDownloads) { this.totalDownloads = totalDownloads; }
 
    public Long getDeveloperId() { return developerId; }
    public void setDeveloperId(Long developerId) { this.developerId = developerId; }
 
    public Long getCategoryId() { return categoryId; }
    public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }
}