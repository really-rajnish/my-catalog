package auth.dto;

import auth.model.Product;

public class SearchResultDTO {
    private Product product;
    private String matchType; // "Keyword match" or "Semantic match"
    private Long timeTakenMs;
    private Float score;

    public SearchResultDTO(Product product, String matchType, Long timeTakenMs, Float score) {
        this.product = product;
        this.matchType = matchType;
        this.timeTakenMs = timeTakenMs;
        this.score = score;
    }

    // Getters
    public Product getProduct() { return product; }
    public String getMatchType() { return matchType; }
    public Long getTimeTakenMs() { return timeTakenMs; }
    public Float getScore() { return score; }
}
