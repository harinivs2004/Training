package com.wipro.service.impl;
 
import com.wipro.dto.AppVersionDTO;
import com.wipro.entity.*;
import com.wipro.exception.ResourceNotFoundException;
import com.wipro.repository.*;
import com.wipro.service.AppVersionService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
 
@Service
public class AppVersionServiceImpl implements AppVersionService {
 
    private static final Logger log = LoggerFactory.getLogger(AppVersionServiceImpl.class);
 
    private final AppVersionRepository appVersionRepository;
    private final AppRepository appRepository;
 
    public AppVersionServiceImpl(AppVersionRepository appVersionRepository, AppRepository appRepository) {
        this.appVersionRepository = appVersionRepository;
        this.appRepository = appRepository;
    }
 
    @Override
    public AppVersionDTO createAppVersion(AppVersionDTO dto) {
        log.info("Creating app version: {}", dto.getVersionName());
        App app = appRepository.findById(dto.getAppId())
                .orElseThrow(() -> new ResourceNotFoundException("App not found with id: " + dto.getAppId()));
        AppVersion version = new AppVersion();
        version.setVersionName(dto.getVersionName());
        version.setReleaseNotes(dto.getReleaseNotes());
        version.setReleaseDate(LocalDateTime.now());
        version.setApp(app);
        return mapToDTO(appVersionRepository.save(version));
    }
 
    @Override
    public AppVersionDTO getAppVersionById(Long id) {
        log.info("Fetching app version by id: {}", id);
        AppVersion version = appVersionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("AppVersion not found with id: " + id));
        return mapToDTO(version);
    }
 
    @Override
    public List<AppVersionDTO> getAllAppVersions() {
        log.info("Fetching all app versions");
        return appVersionRepository.findAll().stream().map(this::mapToDTO).collect(Collectors.toList());
    }
 
    @Override
    public List<AppVersionDTO> getVersionsByAppId(Long appId) {
        log.info("Fetching versions for app id: {}", appId);
        return appVersionRepository.findByAppId(appId).stream().map(this::mapToDTO).collect(Collectors.toList());
    }
 
    @Override
    public AppVersionDTO updateAppVersion(Long id, AppVersionDTO dto) {
        log.info("Updating app version with id: {}", id);
        AppVersion version = appVersionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("AppVersion not found with id: " + id));
        version.setVersionName(dto.getVersionName());
        version.setReleaseNotes(dto.getReleaseNotes());
        return mapToDTO(appVersionRepository.save(version));
    }
 
    @Override
    public void deleteAppVersion(Long id) {
        log.info("Deleting app version with id: {}", id);
        appVersionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("AppVersion not found with id: " + id));
        appVersionRepository.deleteById(id);
    }
 
    private AppVersionDTO mapToDTO(AppVersion v) {
        AppVersionDTO dto = new AppVersionDTO();
        dto.setId(v.getId());
        dto.setVersionName(v.getVersionName());
        dto.setReleaseNotes(v.getReleaseNotes());
        dto.setReleaseDate(v.getReleaseDate());
        dto.setAppId(v.getApp().getId());
        return dto;
    }
}