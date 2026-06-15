package auth.repository;

import auth.model.Product;
import auth.dto.FilterRequest;
import org.springframework.data.jpa.domain.Specification;
import jakarta.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;

public class ProductSpecifications {

    public static Specification<Product> withFilter(FilterRequest filter) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (filter.getCategoryId() != null) {
                predicates.add(cb.equal(root.get("category").get("id"), filter.getCategoryId()));
            }

            if (filter.getBrands() != null && !filter.getBrands().isEmpty()) {
                predicates.add(root.get("brand").in(filter.getBrands()));
            }

            if (filter.getMinPrice() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("price"), filter.getMinPrice()));
            }

            if (filter.getMaxPrice() != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("price"), filter.getMaxPrice()));
            }

            if (filter.getInStockOnly() != null && filter.getInStockOnly()) {
                predicates.add(cb.isTrue(root.get("inStock")));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
