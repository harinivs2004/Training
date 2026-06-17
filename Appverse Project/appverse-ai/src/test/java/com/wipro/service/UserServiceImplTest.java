package com.wipro.service;
 
import com.wipro.config.JwtUtil;
import com.wipro.dto.LoginDTO;
import com.wipro.dto.UserDTO;
import com.wipro.entity.User;
import com.wipro.exception.ResourceNotFoundException;
import com.wipro.repository.UserRepository;
import com.wipro.service.impl.UserServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;
 
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
 
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;
 
@ExtendWith(MockitoExtension.class)
public class UserServiceImplTest {
 
    @Mock
    private UserRepository userRepository;
 
    @Mock
    private PasswordEncoder passwordEncoder;
 
    @Mock
    private JwtUtil jwtUtil;
 
    @InjectMocks
    private UserServiceImpl userService;
 
    private User testUser;
    private UserDTO testUserDTO;
 
    @BeforeEach
    void setUp() {
        // Create test data before each test
        testUser = new User();
        testUser.setId(1L);
        testUser.setName("John Developer");
        testUser.setEmail("john@example.com");
        testUser.setPassword("$2a$10$encodedpassword");
        testUser.setRole(User.Role.DEVELOPER);
 
        testUserDTO = new UserDTO();
        testUserDTO.setName("John Developer");
        testUserDTO.setEmail("john@example.com");
        testUserDTO.setPassword("pass123");
        testUserDTO.setRole("DEVELOPER");
    }
 
    // TEST 1 — Register user successfully
    @Test
    void testRegisterUser_Success() {
        // ARRANGE — set up what mocks should return
        when(userRepository.existsByEmail(anyString())).thenReturn(false);
        when(passwordEncoder.encode(anyString())).thenReturn("$2a$10$encodedpassword");
        when(userRepository.save(any(User.class))).thenReturn(testUser);
 
        // ACT — call the actual method
        UserDTO result = userService.registerUser(testUserDTO);
 
        // ASSERT — check the result
        assertNotNull(result);
        assertEquals("John Developer", result.getName());
        assertEquals("john@example.com", result.getEmail());
        assertEquals("DEVELOPER", result.getRole());
        assertNull(result.getPassword()); // password should not be in response
    }
 
    // TEST 2 — Register with existing email should throw exception
    @Test
    void testRegisterUser_EmailAlreadyExists() {
        when(userRepository.existsByEmail(anyString())).thenReturn(true);
 
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            userService.registerUser(testUserDTO);
        });
 
        assertEquals("Email already registered: john@example.com", exception.getMessage());
        verify(userRepository, never()).save(any()); // save should never be called
    }
 
    // TEST 3 — Get user by ID successfully
    @Test
    void testGetUserById_Success() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
 
        UserDTO result = userService.getUserById(1L);
 
        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("John Developer", result.getName());
    }
 
    // TEST 4 — Get user by ID not found
    @Test
    void testGetUserById_NotFound() {
        when(userRepository.findById(999L)).thenReturn(Optional.empty());
 
        assertThrows(ResourceNotFoundException.class, () -> {
            userService.getUserById(999L);
        });
    }
 
    // TEST 5 — Get all users
    @Test
    void testGetAllUsers() {
        User user2 = new User();
        user2.setId(2L);
        user2.setName("Mary User");
        user2.setEmail("mary@example.com");
        user2.setRole(User.Role.USER);
 
        when(userRepository.findAll()).thenReturn(Arrays.asList(testUser, user2));
 
        List<UserDTO> result = userService.getAllUsers();
 
        assertEquals(2, result.size());
        assertEquals("John Developer", result.get(0).getName());
        assertEquals("Mary User", result.get(1).getName());
    }
 
    // TEST 6 — Login successfully
    @Test
    void testLoginUser_Success() {
        LoginDTO loginDTO = new LoginDTO();
        loginDTO.setEmail("john@example.com");
        loginDTO.setPassword("pass123");
 
        when(userRepository.findByEmail("john@example.com")).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches("pass123", testUser.getPassword())).thenReturn(true);
        when(jwtUtil.generateToken("john@example.com")).thenReturn("mock.jwt.token");
 
        var result = userService.loginUser(loginDTO);
 
        assertNotNull(result);
        assertEquals("mock.jwt.token", result.getToken());
        assertEquals("john@example.com", result.getEmail());
        assertEquals("Login successful", result.getMessage());
    }
 
    // TEST 7 — Login with wrong password
    @Test
    void testLoginUser_WrongPassword() {
        LoginDTO loginDTO = new LoginDTO();
        loginDTO.setEmail("john@example.com");
        loginDTO.setPassword("wrongpassword");
 
        when(userRepository.findByEmail("john@example.com")).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches("wrongpassword", testUser.getPassword())).thenReturn(false);
 
        assertThrows(RuntimeException.class, () -> {
            userService.loginUser(loginDTO);
        });
    }
 
    // TEST 8 — Delete user
    @Test
    void testDeleteUser_Success() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        doNothing().when(userRepository).deleteById(1L);
 
        assertDoesNotThrow(() -> userService.deleteUser(1L));
        verify(userRepository, times(1)).deleteById(1L);
    }
}
 