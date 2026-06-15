package auth.repository;

import auth.document.SearchLogDocument;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SearchLogRepository extends MongoRepository<SearchLogDocument, String> {
}
