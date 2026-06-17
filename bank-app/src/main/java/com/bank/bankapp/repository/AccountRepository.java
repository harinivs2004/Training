package com.bank.bankapp.repository;

import com.bank.bankapp.entity.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AccountRepository extends JpaRepository<Account, Long> {
    List<Account> findByHolderName(String name);
}
