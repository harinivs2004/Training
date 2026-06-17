package com.bank.bankapp.service;

import com.bank.bankapp.entity.Account;
import com.bank.bankapp.repository.AccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AccountService {

    @Autowired
    private AccountRepository repo;

    public Account save(Account acc) {
        return repo.save(acc);
    }

    public List<Account> findAll() {
        return repo.findAll(Sort.by("holderName"));
    }

    public Account findById(Long id) {
        return repo.findById(id).orElseThrow();
    }

    public List<Account> findByName(String name) {
        return repo.findByHolderName(name);
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }
}