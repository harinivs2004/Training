package com.wipro.service.impl;
 
import com.wipro.dto.RecommendationDTO;
import com.wipro.entity.*;
import com.wipro.exception.ResourceNotFoundException;
import com.wipro.repository.*;
import com.wipro.service.RecommendationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;
 
@Service
public class RecommendationServiceImpl implements RecommendationService {
 
    private static final Logger log = LoggerFactory.getLogger(RecommendationServiceImpl.class);
 
    private final RecommendationRepository recommendationRepository;
    private final UserRepository userRepository;
    private final AppRepository appRepository;
 
    public RecommendationServiceImpl(RecommendationRepository recommendationRepository, UserRepository userRepository, AppRepository appRepository) {
        this.recommendationRepository = recommendationRepository;
        this.userRepository = userRepository;
        this.appRepository = appRepository;
    }
 
    @Override
    public RecommendationDTO createRecommendation(RecommendationDTO dto) {
        log.info("Creating recommendation for user id: {}", dto.getUserId());
        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + dto.getUserId()));
        App app = appRepository.findById(dto.getAppId())
                .orElseThrow(() -> new ResourceNotFoundException("App not found with id: " + dto.getAppId()));
        Recommendation rec = new Recommendation();
        rec.setReason(dto.getReason());
        rec.setScore(dto.getScore());
        rec.setUser(user);
        rec.setApp(app);
        return mapToDTO(recommendationRepository.save(rec));
    }
 
    @Override
    public RecommendationDTO getRecommendationById(Long id) {
        log.info("Fetching recommendation by id: {}", id);
        Recommendation rec = recommendationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Recommendation not found with id: " + id));
        return mapToDTO(rec);
    }
 
    @Override
    public List<RecommendationDTO> getAllRecommendations() {
        log.info("Fetching all recommendations");
        return recommendationRepository.findAll().stream().map(this::mapToDTO).collect(Collectors.toList());
    }
 
    @Override
    public List<RecommendationDTO> getRecommendationsByUser(Long userId) {
        log.info("Fetching recommendations for user id: {}", userId);
        return recommendationRepository.findByUserId(userId).stream().map(this::mapToDTO).collect(Collectors.toList());
    }
 
    @Override
    public void deleteRecommendation(Long id) {
        log.info("Deleting recommendation with id: {}", id);
        recommendationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Recommendation not found with id: " + id));
        recommendationRepository.deleteById(id);
    }
 
    private RecommendationDTO mapToDTO(Recommendation r) {
        RecommendationDTO dto = new RecommendationDTO();
        dto.setId(r.getId());
        dto.setReason(r.getReason());
        dto.setScore(r.getScore());
        dto.setUserId(r.getUser().getId());
        dto.setAppId(r.getApp().getId());
        return dto;
    }
}