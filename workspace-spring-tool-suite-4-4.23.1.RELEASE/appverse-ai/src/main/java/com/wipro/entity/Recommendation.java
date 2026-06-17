package com.wipro.entity;
 
import jakarta.persistence.*;
 
@Entity
@Table(name = "recommendation")
public class Recommendation {
 
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
 
    private String reason;
 
    private Double score;
 
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
 
    @ManyToOne
    @JoinColumn(name = "app_id", nullable = false)
    private App app;
 
    public Recommendation() {}
 
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
 
    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }
 
    public Double getScore() { return score; }
    public void setScore(Double score) { this.score = score; }
 
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
 
    public App getApp() { return app; }
    public void setApp(App app) { this.app = app; }
}
 