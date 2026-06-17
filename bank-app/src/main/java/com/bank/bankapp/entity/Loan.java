package com.bank.bankapp.entity;

import jakarta.persistence.*;

@Entity
public class Loan {

    @Id
    @GeneratedValue
    private Long id;

    private Double amount;
    private String loanType;

    public Long getId() { return id; }

    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }

    public String getLoanType() { return loanType; }
    public void setLoanType(String loanType) { this.loanType = loanType; }
}