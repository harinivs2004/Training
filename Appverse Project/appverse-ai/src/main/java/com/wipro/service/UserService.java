package com.wipro.service;
 
import com.wipro.dto.*;
import java.util.List;
 
public interface UserService {
    UserDTO registerUser(UserDTO userDTO);
    AuthResponseDTO loginUser(LoginDTO loginDTO);
    UserDTO getUserById(Long id);
    List<UserDTO> getAllUsers();
    UserDTO updateUser(Long id, UserDTO userDTO);
    void deleteUser(Long id);
}