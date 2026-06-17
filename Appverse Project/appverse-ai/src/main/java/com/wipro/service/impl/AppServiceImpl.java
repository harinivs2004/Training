package com.wipro.service.impl;
 
import com.wipro.dto.AppDTO;
import com.wipro.entity.*;
import com.wipro.exception.ResourceNotFoundException;
import com.wipro.repository.*;
import com.wipro.service.AppService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;
 
@Service
public class AppServiceImpl implements AppService {
 
    private static final Logger log = LoggerFactory.getLogger(AppServiceImpl.class);
 
    private final AppRepository appRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
 
    public AppServiceImpl(AppRepository appRepository, UserRepository userRepository, CategoryRepository categoryRepository) {
        this.appRepository = appRepository;
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
    }
 
    @Override
    public AppDTO createApp(AppDTO appDTO) {
        log.info("Creating app: {}", appDTO.getName());
        User developer = userRepository.findById(appDTO.getDeveloperId())
                .orElseThrow(() -> new ResourceNotFoundException("Developer not found with id: " + appDTO.getDeveloperId()));
        Category category = categoryRepository.findById(appDTO.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + appDTO.getCategoryId()));
        App app = new App();
        app.setName(appDTO.getName());
        app.setDescription(appDTO.getDescription());
        app.setIconUrl(appDTO.getIconUrl());
        app.setAverageRating(appDTO.getAverageRating());
        app.setTotalDownloads(appDTO.getTotalDownloads());
        app.setDeveloper(developer);
        app.setCategory(category);
        return mapToDTO(appRepository.save(app));
    }
 
    @Override
    public AppDTO getAppById(Long id) {
        log.info("Fetching app by id: {}", id);
        App app = appRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("App not found with id: " + id));
        return mapToDTO(app);
    }
 
    @Override
    public List<AppDTO> getAllApps() {
        log.info("Fetching all apps");
        return appRepository.findAll().stream().map(this::mapToDTO).collect(Collectors.toList());
    }
 
    @Override
    public List<AppDTO> searchApps(String keyword) {
        log.info("Searching apps with keyword: {}", keyword);
        return appRepository.findByNameContainingIgnoreCase(keyword).stream().map(this::mapToDTO).collect(Collectors.toList());
    }
 
    @Override
    public List<AppDTO> getAppsByCategory(Long categoryId) {
        log.info("Fetching apps by category id: {}", categoryId);
        return appRepository.findByCategoryId(categoryId).stream().map(this::mapToDTO).collect(Collectors.toList());
    }
 
    @Override
    public AppDTO updateApp(Long id, AppDTO appDTO) {
        log.info("Updating app with id: {}", id);
        App app = appRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("App not found with id: " + id));
        app.setName(appDTO.getName());
        app.setDescription(appDTO.getDescription());
        app.setIconUrl(appDTO.getIconUrl());
        app.setAverageRating(appDTO.getAverageRating());
        app.setTotalDownloads(appDTO.getTotalDownloads());
        return mapToDTO(appRepository.save(app));
    }
 
    @Override
    public void deleteApp(Long id) {
        log.info("Deleting app with id: {}", id);
        appRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("App not found with id: " + id));
        appRepository.deleteById(id);
    }
 
    private AppDTO mapToDTO(App app) {
        AppDTO dto = new AppDTO();
        dto.setId(app.getId());
        dto.setName(app.getName());
        dto.setDescription(app.getDescription());
        dto.setIconUrl(app.getIconUrl());
        dto.setAverageRating(app.getAverageRating());
        dto.setTotalDownloads(app.getTotalDownloads());
        dto.setDeveloperId(app.getDeveloper().getId());
        dto.setCategoryId(app.getCategory().getId());
        return dto;
    }
}