package com.wipro.service;
 
import com.wipro.dto.AppVersionDTO;
import java.util.List;
 
public interface AppVersionService {
    AppVersionDTO createAppVersion(AppVersionDTO dto);
    AppVersionDTO getAppVersionById(Long id);
    List<AppVersionDTO> getAllAppVersions();
    List<AppVersionDTO> getVersionsByAppId(Long appId);
    AppVersionDTO updateAppVersion(Long id, AppVersionDTO dto);
    void deleteAppVersion(Long id);
}