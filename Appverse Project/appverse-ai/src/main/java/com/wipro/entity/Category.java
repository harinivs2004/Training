package com.wipro.entity;
 
import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.util.List;
 
@Entity
@Table(name = "category")
public class Category {
 
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
 
    @Column(nullable = false, unique = true)
    private String name;
 
    private String description;
 
    @JsonIgnore
    @OneToMany(mappedBy = "category")
    private List<App> apps;
 
    public Category() {}
 
    public Category(Long id, String name, String description, List<App> apps) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.apps = apps;
    }
 
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
 
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
 
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
 
    public List<App> getApps() { return apps; }
    public void setApps(List<App> apps) { this.apps = apps; }
}