package com.lakshminarayanan.productinventory.repository;

import com.lakshminarayanan.productinventory.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Long> {
}