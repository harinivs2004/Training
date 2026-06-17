package com.wipro.controller;
 
import com.wipro.dto.AppVersionDTO;
import com.wipro.service.AppVersionService;
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
import org.springframework.web.bind.annotation.RestController;
import java.util.List;
 
@RestController
@RequestMapping("/api/app-versions")
@CrossOrigin(origins = "http://localhost:3000")
public class AppVersionController {
 
    private final AppVersionService appVersionService;
 
    public AppVersionController(AppVersionService appVersionService) {
        this.appVersionService = appVersionService;
    }
 
    @PostMapping
    public ResponseEntity<AppVersionDTO> create(@Valid @RequestBody AppVersionDTO dto) {
        return new ResponseEntity<>(appVersionService.createAppVersion(dto), HttpStatus.CREATED);
    }
 
    @GetMapping("/{id}")
    public ResponseEntity<AppVersionDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(appVersionService.getAppVersionById(id));
    }
 
    @GetMapping
    public ResponseEntity<List<AppVersionDTO>> getAll() {
        return ResponseEntity.ok(appVersionService.getAllAppVersions());
    }
 
    @GetMapping("/app/{appId}")
    public ResponseEntity<List<AppVersionDTO>> getByAppId(@PathVariable Long appId) {
        return ResponseEntity.ok(appVersionService.getVersionsByAppId(appId));
    }
 
    @PutMapping("/{id}")
    public ResponseEntity<AppVersionDTO> update(@PathVariable Long id,
                                                 @Valid @RequestBody AppVersionDTO dto) {
        return ResponseEntity.ok(appVersionService.updateAppVersion(id, dto));
    }
 
    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        appVersionService.deleteAppVersion(id);
        return ResponseEntity.ok("AppVersion deleted successfully");
    }
}