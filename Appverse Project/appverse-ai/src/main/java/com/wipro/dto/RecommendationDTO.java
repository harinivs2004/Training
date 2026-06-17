package com.wipro.dto;
 
import jakarta.validation.constraints.*;
 
public class RecommendationDTO {
 
    private Long id;
 
    @NotBlank(message = "Reason is required")
    private String reason;
 
    @DecimalMin(value = "0.0", message = "Score must be at least 0.0")
    @DecimalMax(value = "10.0", message = "Score must be at most 10.0")
    private Double score;
 
    @NotNull(message = "User ID is required")
    private Long userId;
 
    @NotNull(message = "App ID is required")
    private Long appId;
 
    public RecommendationDTO() {}
 
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
 
    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }
 
    public Double getScore() { return score; }
    public void setScore(Double score) { this.score = score; }
 
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
 
    public Long getAppId() { return appId; }
    public void setAppId(Long appId) { this.appId = appId; }
}
 