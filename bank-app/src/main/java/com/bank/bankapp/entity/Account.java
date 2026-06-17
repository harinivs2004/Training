package com.bank.bankapp.entity;

import jakarta.persistence.*;

@Entity
public class Account {

    @Id
    @GeneratedValue
    private Long id;

    private String holderName;
    private Double balance;

    public Long getId() { return id; }

    public String getHolderName() { return holderName; }
    public void setHolderName(String holderName) { this.holderName = holderName; }

    public Double getBalance() { return balance; }
    public void setBalance(Double balance) { this.balance = balance; }
}