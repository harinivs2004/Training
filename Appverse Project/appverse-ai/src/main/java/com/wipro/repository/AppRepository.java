package com.wipro.repository;
 
import com.wipro.entity.App;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
 
public interface AppRepository extends JpaRepository<App, Long> {
    List<App> findByNameContainingIgnoreCase(String keyword);
    List<App> findByCategoryId(Long categoryId);
}