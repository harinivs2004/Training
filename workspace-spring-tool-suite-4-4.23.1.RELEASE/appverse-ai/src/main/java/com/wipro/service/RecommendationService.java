package com.wipro.service;
 
import com.wipro.dto.RecommendationDTO;
import java.util.List;
 
public interface RecommendationService {
    RecommendationDTO createRecommendation(RecommendationDTO dto);
    RecommendationDTO getRecommendationById(Long id);
    List<RecommendationDTO> getAllRecommendations();
    List<RecommendationDTO> getRecommendationsByUser(Long userId);
    void deleteRecommendation(Long id);
}