package com.wipro.service.impl;
 
import com.wipro.dto.DeveloperProfileDTO;
import com.wipro.entity.*;
import com.wipro.exception.ResourceNotFoundException;
import com.wipro.repository.*;
import com.wipro.service.DeveloperProfileService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;
 
@Service
public class DeveloperProfileServiceImpl implements DeveloperProfileService {
 
    private static final Logger log = LoggerFactory.getLogger(DeveloperProfileServiceImpl.class);
 
    private final DeveloperProfileRepository developerProfileRepository;
    private final UserRepository userRepository;
 
    public DeveloperProfileServiceImpl(DeveloperProfileRepository developerProfileRepository, UserRepository userRepository) {
        this.developerProfileRepository = developerProfileRepository;
        this.userRepository = userRepository;
    }
 
    @Override
    public DeveloperProfileDTO createProfile(DeveloperProfileDTO dto) {
        log.info("Creating developer profile for user id: {}", dto.getUserId());
        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + dto.getUserId()));
        DeveloperProfile profile = new DeveloperProfile();
        profile.setCompanyName(dto.getCompanyName());
        profile.setWebsite(dto.getWebsite());
        profile.setBio(dto.getBio());
        profile.setUser(user);
        return mapToDTO(developerProfileRepository.save(profile));
    }
 
    @Override
    public DeveloperProfileDTO getProfileById(Long id) {
        log.info("Fetching developer profile by id: {}", id);
        DeveloperProfile profile = developerProfileRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Developer profile not found with id: " + id));
        return mapToDTO(profile);
    }
 
    @Override
    public DeveloperProfileDTO getProfileByUserId(Long userId) {
        log.info("Fetching developer profile for user id: {}", userId);
        DeveloperProfile profile = developerProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Developer profile not found for user id: " + userId));
        return mapToDTO(profile);
    }
 
    @Override
    public List<DeveloperProfileDTO> getAllProfiles() {
        log.info("Fetching all developer profiles");
        return developerProfileRepository.findAll().stream().map(this::mapToDTO).collect(Collectors.toList());
    }
 
    @Override
    public DeveloperProfileDTO updateProfile(Long id, DeveloperProfileDTO dto) {
        log.info("Updating developer profile with id: {}", id);
        DeveloperProfile profile = developerProfileRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Developer profile not found with id: " + id));
        profile.setCompanyName(dto.getCompanyName());
        profile.setWebsite(dto.getWebsite());
        profile.setBio(dto.getBio());
        return mapToDTO(developerProfileRepository.save(profile));
    }
 
    @Override
    public void deleteProfile(Long id) {
        log.info("Deleting developer profile with id: {}", id);
        developerProfileRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Developer profile not found with id: " + id));
        developerProfileRepository.deleteById(id);
    }
 
    private DeveloperProfileDTO mapToDTO(DeveloperProfile p) {
        DeveloperProfileDTO dto = new DeveloperProfileDTO();
        dto.setId(p.getId());
        dto.setCompanyName(p.getCompanyName());
        dto.setWebsite(p.getWebsite());
        dto.setBio(p.getBio());
        dto.setUserId(p.getUser().getId());
        return dto;
    }
}