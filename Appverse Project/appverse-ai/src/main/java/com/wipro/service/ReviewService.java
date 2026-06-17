package com.wipro.service;
 
import com.wipro.dto.ReviewDTO;
import java.util.List;
 
public interface ReviewService {
    ReviewDTO createReview(ReviewDTO dto);
    ReviewDTO getReviewById(Long id);
    List<ReviewDTO> getAllReviews();
    List<ReviewDTO> getReviewsByAppId(Long appId);
    ReviewDTO updateReview(Long id, ReviewDTO dto);
    void deleteReview(Long id);
}