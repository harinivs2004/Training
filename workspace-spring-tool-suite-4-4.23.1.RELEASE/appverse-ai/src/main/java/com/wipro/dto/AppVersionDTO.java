package com.wipro.dto;
 
import jakarta.validation.constraints.*;
import java.time.LocalDateTime;
 
public class AppVersionDTO {
 
    private Long id;
 
    @NotBlank(message = "Version name is required")
    private String versionName;
 
    @Size(max = 500, message = "Release notes cannot exceed 500 characters")
    private String releaseNotes;
 
    private LocalDateTime releaseDate;
 
    @NotNull(message = "App ID is required")
    private Long appId;
 
    public AppVersionDTO() {}
 
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
 
    public String getVersionName() { return versionName; }
    public void setVersionName(String versionName) { this.versionName = versionName; }
 
    public String getReleaseNotes() { return releaseNotes; }
    public void setReleaseNotes(String releaseNotes) { this.releaseNotes = releaseNotes; }
 
    public LocalDateTime getReleaseDate() { return releaseDate; }
    public void setReleaseDate(LocalDateTime releaseDate) { this.releaseDate = releaseDate; }
 
    public Long getAppId() { return appId; }
    public void setAppId(Long appId) { this.appId = appId; }
}