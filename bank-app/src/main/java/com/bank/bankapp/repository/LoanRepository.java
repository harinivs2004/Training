package com.bank.bankapp.repository;

import com.bank.bankapp.entity.Loan;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface LoanRepository extends JpaRepository<Loan, Long> {
    List<Loan> findByLoanType(String type);
}