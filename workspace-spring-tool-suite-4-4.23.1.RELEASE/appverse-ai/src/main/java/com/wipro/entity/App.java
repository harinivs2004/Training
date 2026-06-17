package com.wipro.entity;
 
import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.util.List;
 
@Entity
@Table(name = "app")
public class App {
 
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
 
    @Column(nullable = false)
    private String name;
 
    private String description;
 
    private String iconUrl;
 
    private Double averageRating;
 
    private Long totalDownloads;
 
    @ManyToOne
    @JoinColumn(name = "developer_id", nullable = false)
    private User developer;
 
    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;
 
    @JsonIgnore
    @OneToMany(mappedBy = "app", cascade = CascadeType.ALL)
    private List<Review> reviews;
 
    @JsonIgnore
    @OneToMany(mappedBy = "app", cascade = CascadeType.ALL)
    private List<Download> downloads;
 
    @JsonIgnore
    @OneToMany(mappedBy = "app", cascade = CascadeType.ALL)
    private List<AppVersion> appVersions;
 
    public App() {}
 
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
 
    public User getDeveloper() { return developer; }
    public void setDeveloper(User developer) { this.developer = developer; }
 
    public Category getCategory() { return category; }
    public void setCategory(Category category) { this.category = category; }
 
    public List<Review> getReviews() { return reviews; }
    public void setReviews(List<Review> reviews) { this.reviews = reviews; }
 
    public List<Download> getDownloads() { return downloads; }
    public void setDownloads(List<Download> downloads) { this.downloads = downloads; }
 
    public List<AppVersion> getAppVersions() { return appVersions; }
    public void setAppVersions(List<AppVersion> appVersions) { this.appVersions = appVersions; }
}