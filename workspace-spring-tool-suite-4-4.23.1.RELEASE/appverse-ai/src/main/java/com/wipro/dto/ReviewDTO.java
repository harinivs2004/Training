package com.wipro.dto;
 
import jakarta.validation.constraints.*;
import java.time.LocalDateTime;
 
public class ReviewDTO {
 
    private Long id;
 
    @NotBlank(message = "Comment is required")
    @Size(min = 5, max = 500, message = "Comment must be between 5 and 500 characters")
    private String comment;
 
    @NotNull(message = "Rating is required")
    @Min(value = 1, message = "Rating must be at least 1")
    @Max(value = 5, message = "Rating must be at most 5")
    private Integer rating;
    
    private String sentiment;
    
    private LocalDateTime reviewDate;
 
    @NotNull(message = "User ID is required")
    private Long userId;
 
    @NotNull(message = "App ID is required")
    private Long appId;
 
    public ReviewDTO() {}
 
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
 
    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }
 
    public Integer getRating() { return rating; }
    public void setRating(Integer rating) { this.rating = rating; }
    
    
    
 // Add getter and setter
 public String getSentiment() { return sentiment; }
 public void setSentiment(String sentiment) { this.sentiment = sentiment; }// Add this method at the bottom of the class before the last }
 
    public LocalDateTime getReviewDate() { return reviewDate; }
    public void setReviewDate(LocalDateTime reviewDate) { this.reviewDate = reviewDate; }
 
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
 
    public Long getAppId() { return appId; }
    public void setAppId(Long appId) { this.appId = appId; }
}