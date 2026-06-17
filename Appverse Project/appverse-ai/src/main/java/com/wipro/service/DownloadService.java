package com.wipro.service;
 
import com.wipro.dto.DownloadDTO;
import java.util.List;
 
public interface DownloadService {
    DownloadDTO downloadApp(Long userId, Long appId);
    List<DownloadDTO> getDownloadsByUser(Long userId);
    List<DownloadDTO> getDownloadsByApp(Long appId);
    long getTotalDownloads(Long appId);
    List<DownloadDTO> getAllDownloads();
}