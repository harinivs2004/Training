package com.wipro.dto;
 
import jakarta.validation.constraints.*;
import java.time.LocalDateTime;
 
public class DownloadDTO {
 
    private Long id;
    private LocalDateTime downloadedAt;
 
    @NotNull(message = "User ID is required")
    private Long userId;
 
    @NotNull(message = "App ID is required")
    private Long appId;
 
    public DownloadDTO() {}
 
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
 
    public LocalDateTime getDownloadedAt() { return downloadedAt; }
    public void setDownloadedAt(LocalDateTime downloadedAt) { this.downloadedAt = downloadedAt; }
 
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
 
    public Long getAppId() { return appId; }
    public void setAppId(Long appId) { this.appId = appId; }
}