package com.wipro.entity;
 
import jakarta.persistence.*;
import java.time.LocalDateTime;
 
@Entity
@Table(name = "app_version")
public class AppVersion {
 
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
 
    @Column(nullable = false)
    private String versionName;
 
    private String releaseNotes;
 
    private LocalDateTime releaseDate;
 
    @ManyToOne
    @JoinColumn(name = "app_id", nullable = false)
    private App app;
 
    public AppVersion() {}
 
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
 
    public String getVersionName() { return versionName; }
    public void setVersionName(String versionName) { this.versionName = versionName; }
 
    public String getReleaseNotes() { return releaseNotes; }
    public void setReleaseNotes(String releaseNotes) { this.releaseNotes = releaseNotes; }
 
    public LocalDateTime getReleaseDate() { return releaseDate; }
    public void setReleaseDate(LocalDateTime releaseDate) { this.releaseDate = releaseDate; }
 
    public App getApp() { return app; }
    public void setApp(App app) { this.app = app; }
}