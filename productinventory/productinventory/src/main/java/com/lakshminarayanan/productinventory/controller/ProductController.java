package com.lakshminarayanan.productinventory.controller;

import com.lakshminarayanan.productinventory.model.Product;
import com.lakshminarayanan.productinventory.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:5173")
public class ProductController {
    @Autowired
    private ProductService service;

    // ➕ CREATE PRODUCT
    @PostMapping
    public String addProduct(@RequestBody Product product) {
        service.saveProduct(product);
        return "Product added successfully";
    }

    // 📄 GET ALL PRODUCTS
    @GetMapping
    public List<Product> getAllProducts() {
        return service.getAllProducts();
    }

    // 🔍 GET PRODUCT BY ID
    @GetMapping("/{id}")
    public Product getProduct(@PathVariable Long id) {
        return service.getProductById(id);
    }

    // ✏️ UPDATE PRODUCT
    @PutMapping("/{id}")
    public String updateProduct(@PathVariable Long id, @RequestBody Product product) {
        product.setId(id);
        service.updateProduct(product);
        return "Product updated successfully";
    }

    // ❌ DELETE PRODUCT
    @DeleteMapping("/{id}")
    public String deleteProduct(@PathVariable Long id) {
        service.deleteProduct(id);
        return "Product deleted successfully";
    }
}