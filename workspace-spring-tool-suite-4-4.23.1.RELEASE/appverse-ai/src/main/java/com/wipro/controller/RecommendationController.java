package com.wipro.controller;
 
import com.wipro.dto.RecommendationDTO;
import com.wipro.service.RecommendationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;
 
@RestController
@RequestMapping("/api/recommendations")
@CrossOrigin(origins = "http://localhost:3000")
public class RecommendationController {
 
    private final RecommendationService recommendationService;
 
    public RecommendationController(RecommendationService recommendationService) {
        this.recommendationService = recommendationService;
    }
 
    @PostMapping
    public ResponseEntity<RecommendationDTO> create(@Valid @RequestBody RecommendationDTO dto) {
        return new ResponseEntity<>(recommendationService.createRecommendation(dto), HttpStatus.CREATED);
    }
 
    @GetMapping("/{id}")
    public ResponseEntity<RecommendationDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(recommendationService.getRecommendationById(id));
    }
 
    @GetMapping
    public ResponseEntity<List<RecommendationDTO>> getAll() {
        return ResponseEntity.ok(recommendationService.getAllRecommendations());
    }
 
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<RecommendationDTO>> getByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(recommendationService.getRecommendationsByUser(userId));
    }
 
    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        recommendationService.deleteRecommendation(id);
        return ResponseEntity.ok("Recommendation deleted successfully");
    }
}