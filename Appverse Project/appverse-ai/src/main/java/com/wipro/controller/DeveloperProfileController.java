package com.wipro.controller;
 
import com.wipro.dto.DeveloperProfileDTO;
import com.wipro.service.DeveloperProfileService;
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
@RequestMapping("/api/developer-profiles")
@CrossOrigin(origins = "http://localhost:3000")
public class DeveloperProfileController {
 
    private final DeveloperProfileService developerProfileService;
 
    public DeveloperProfileController(DeveloperProfileService developerProfileService) {
        this.developerProfileService = developerProfileService;
    }
 
    @PostMapping
    public ResponseEntity<DeveloperProfileDTO> create(@Valid @RequestBody DeveloperProfileDTO dto) {
        return new ResponseEntity<>(developerProfileService.createProfile(dto), HttpStatus.CREATED);
    }
 
    @GetMapping("/{id}")
    public ResponseEntity<DeveloperProfileDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(developerProfileService.getProfileById(id));
    }
 
    @GetMapping("/user/{userId}")
    public ResponseEntity<DeveloperProfileDTO> getByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(developerProfileService.getProfileByUserId(userId));
    }
 
    @GetMapping
    public ResponseEntity<List<DeveloperProfileDTO>> getAll() {
        return ResponseEntity.ok(developerProfileService.getAllProfiles());
    }
 
    @PutMapping("/{id}")
    public ResponseEntity<DeveloperProfileDTO> update(@PathVariable Long id,
                                                       @Valid @RequestBody DeveloperProfileDTO dto) {
        return ResponseEntity.ok(developerProfileService.updateProfile(id, dto));
    }
 
    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        developerProfileService.deleteProfile(id);
        return ResponseEntity.ok("Developer profile deleted successfully");
    }
}