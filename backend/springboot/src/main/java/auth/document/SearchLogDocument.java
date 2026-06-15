package auth.document;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Document(collection = "user_search_logs")
public class SearchLogDocument {

    @Id
    private String id;
    
    private String query;
    private String type; // "keyword" or "semantic"
    private Integer resultsCount;
    private Long timeTakenMs;
    private LocalDateTime timestamp = LocalDateTime.now();

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getQuery() { return query; }
    public void setQuery(String query) { this.query = query; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public Integer getResultsCount() { return resultsCount; }
    public void setResultsCount(Integer resultsCount) { this.resultsCount = resultsCount; }
    public Long getTimeTakenMs() { return timeTakenMs; }
    public void setTimeTakenMs(Long timeTakenMs) { this.timeTakenMs = timeTakenMs; }
    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}
