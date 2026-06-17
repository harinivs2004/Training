package com.wipro.entity;
 
import jakarta.persistence.*;
 
@Entity
@Table(name = "developer_profile")
public class DeveloperProfile {
 
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
 
    private String companyName;
 
    private String website;
 
    private String bio;
 
    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;
 
    public DeveloperProfile() {}
 
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
 
    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }
 
    public String getWebsite() { return website; }
    public void setWebsite(String website) { this.website = website; }
 
    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }
 
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
}