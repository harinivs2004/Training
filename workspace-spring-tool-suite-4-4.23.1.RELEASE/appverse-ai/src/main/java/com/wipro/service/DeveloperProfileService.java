package com.wipro.service;
 
import com.wipro.dto.DeveloperProfileDTO;
import java.util.List;
 
public interface DeveloperProfileService {
    DeveloperProfileDTO createProfile(DeveloperProfileDTO dto);
    DeveloperProfileDTO getProfileById(Long id);
    DeveloperProfileDTO getProfileByUserId(Long userId);
    List<DeveloperProfileDTO> getAllProfiles();
    DeveloperProfileDTO updateProfile(Long id, DeveloperProfileDTO dto);
    void deleteProfile(Long id);
}