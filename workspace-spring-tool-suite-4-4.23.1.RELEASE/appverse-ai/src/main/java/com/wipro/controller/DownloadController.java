package com.wipro.controller;
 
import com.wipro.dto.DownloadDTO;
import java.util.Map;
import com.wipro.service.DownloadService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;
 
@RestController
@RequestMapping("/api/downloads")
@CrossOrigin(origins = "http://localhost:3000")
public class DownloadController {
 
    private final DownloadService downloadService;
 
    public DownloadController(DownloadService downloadService) {
        this.downloadService = downloadService;
    }
 
    @PostMapping("/user/{userId}/app/{appId}")
    public ResponseEntity<DownloadDTO> downloadApp(@PathVariable Long userId,
                                                    @PathVariable Long appId) {
        return new ResponseEntity<>(downloadService.downloadApp(userId, appId), HttpStatus.CREATED);
    }
 
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<DownloadDTO>> getByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(downloadService.getDownloadsByUser(userId));
    }
 
    @GetMapping("/app/{appId}")
    public ResponseEntity<List<DownloadDTO>> getByApp(@PathVariable Long appId) {
        return ResponseEntity.ok(downloadService.getDownloadsByApp(appId));
    }
 
    @GetMapping("/app/{appId}/count")
    public ResponseEntity<Long> getTotalDownloads(@PathVariable Long appId) {
        return ResponseEntity.ok(downloadService.getTotalDownloads(appId));
    }
 
    @GetMapping
    public ResponseEntity<List<DownloadDTO>> getAll() {
        return ResponseEntity.ok(downloadService.getAllDownloads());
    }
    @GetMapping("/analytics")
    public ResponseEntity<Map<String, Object>> getAnalytics() {
        List<DownloadDTO> all = downloadService.getAllDownloads();
     
        // Count downloads per app
        Map<Long, Long> downloadsPerApp = all.stream()
            .collect(java.util.stream.Collectors.groupingBy(
                DownloadDTO::getAppId,
                java.util.stream.Collectors.counting()
            ));
     
        // Find most downloaded app ID
        Long topAppId = downloadsPerApp.entrySet().stream()
            .max(Map.Entry.comparingByValue())
            .map(Map.Entry::getKey)
            .orElse(null);
     
        Map<String, Object> analytics = new java.util.HashMap<>();
        analytics.put("totalDownloads", all.size());
        analytics.put("downloadsPerApp", downloadsPerApp);
        analytics.put("topAppId", topAppId);
        analytics.put("uniqueApps", downloadsPerApp.size());
     
        return ResponseEntity.ok(analytics);
    }
}