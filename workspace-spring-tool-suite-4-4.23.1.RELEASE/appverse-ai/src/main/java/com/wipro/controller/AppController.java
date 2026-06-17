package com.wipro.controller;
 
import com.wipro.dto.AppDTO;
import com.wipro.service.AppService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;
 
@RestController
@RequestMapping("/api/apps")
@CrossOrigin(origins = "http://localhost:3000")
public class AppController {
 
    private final AppService appService;
 
    public AppController(AppService appService) {
        this.appService = appService;
    }
 
    @PostMapping
    public ResponseEntity<AppDTO> createApp(@Valid @RequestBody AppDTO appDTO) {
        return new ResponseEntity<>(appService.createApp(appDTO), HttpStatus.CREATED);
    }
 
    @GetMapping("/{id}")
    public ResponseEntity<AppDTO> getAppById(@PathVariable Long id) {
        return ResponseEntity.ok(appService.getAppById(id));
    }
 
    @GetMapping
    public ResponseEntity<List<AppDTO>> getAllApps() {
        return ResponseEntity.ok(appService.getAllApps());
    }
 
    @GetMapping("/search")
    public ResponseEntity<List<AppDTO>> searchApps(@RequestParam String keyword) {
        return ResponseEntity.ok(appService.searchApps(keyword));
    }
 
    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<AppDTO>> getAppsByCategory(@PathVariable Long categoryId) {
        return ResponseEntity.ok(appService.getAppsByCategory(categoryId));
    }
 
    @PutMapping("/{id}")
    public ResponseEntity<AppDTO> updateApp(@PathVariable Long id,
                                             @Valid @RequestBody AppDTO appDTO) {
        return ResponseEntity.ok(appService.updateApp(id, appDTO));
    }
 
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteApp(@PathVariable Long id) {
        appService.deleteApp(id);
        return ResponseEntity.ok("App deleted successfully");
    }
    @GetMapping("/trending")
    public ResponseEntity<List<AppDTO>> getTrendingApps() {
        List<AppDTO> all = appService.getAllApps();
        List<AppDTO> trending = all.stream()
            .filter(app -> app.getTotalDownloads() != null)
            .sorted((a, b) -> Long.compare(
                b.getTotalDownloads(), a.getTotalDownloads()))
            .limit(5)
            .collect(java.util.stream.Collectors.toList());
        return ResponseEntity.ok(trending);
    }
}