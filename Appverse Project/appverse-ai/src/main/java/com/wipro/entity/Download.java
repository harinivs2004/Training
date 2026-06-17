package com.wipro.entity;
 
import jakarta.persistence.*;
import java.time.LocalDateTime;
 
@Entity
@Table(name = "download")
public class Download {
 
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
 
    private LocalDateTime downloadedAt;
 
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
 
    @ManyToOne
    @JoinColumn(name = "app_id", nullable = false)
    private App app;
 
    public Download() {}
 
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
 
    public LocalDateTime getDownloadedAt() { return downloadedAt; }
    public void setDownloadedAt(LocalDateTime downloadedAt) { this.downloadedAt = downloadedAt; }
 
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
 
    public App getApp() { return app; }
    public void setApp(App app) { this.app = app; }
}