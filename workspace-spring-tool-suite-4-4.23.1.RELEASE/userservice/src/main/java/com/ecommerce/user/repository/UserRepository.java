package com.ecommerce.user.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.ecommerce.user.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {
}