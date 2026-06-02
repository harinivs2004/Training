package com.bank.bankapp.entity;

import jakarta.persistence.*;

@Entity
public class TransactionEntity {

    @Id
    @GeneratedValue
    private Long id;

    private Double amount;
    private String type;

    public Long getId() { return id; }

    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
}