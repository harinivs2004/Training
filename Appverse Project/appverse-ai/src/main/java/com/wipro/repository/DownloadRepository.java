package com.wipro.repository;
 
import com.wipro.entity.Download;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
 
public interface DownloadRepository extends JpaRepository<Download, Long> {
    List<Download> findByUserId(Long userId);
    List<Download> findByAppId(Long appId);
    long countByAppId(Long appId);
}