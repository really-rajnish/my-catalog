package auth.dto;

import java.math.BigDecimal;
import java.util.List;

public class FilterRequest {
    private Long categoryId;
    private List<String> brands;
    private BigDecimal minPrice;
    private BigDecimal maxPrice;
    private Boolean inStockOnly;
    private String sortBy; // price_asc, price_desc, name_asc, newest

    // Getters and Setters
    public Long getCategoryId() { return categoryId; }
    public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }
    public List<String> getBrands() { return brands; }
    public void setBrands(List<String> brands) { this.brands = brands; }
    public BigDecimal getMinPrice() { return minPrice; }
    public void setMinPrice(BigDecimal minPrice) { this.minPrice = minPrice; }
    public BigDecimal getMaxPrice() { return maxPrice; }
    public void setMaxPrice(BigDecimal maxPrice) { this.maxPrice = maxPrice; }
    public Boolean getInStockOnly() { return inStockOnly; }
    public void setInStockOnly(Boolean inStockOnly) { this.inStockOnly = inStockOnly; }
    public String getSortBy() { return sortBy; }
    public void setSortBy(String sortBy) { this.sortBy = sortBy; }
}
