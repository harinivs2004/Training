package com.wipro.repository;
 
import com.wipro.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
 
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByAppId(Long appId);
    List<Review> findByUserId(Long userId);
}