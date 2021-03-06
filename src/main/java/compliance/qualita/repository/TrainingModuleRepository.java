package compliance.qualita.repository;

import compliance.qualita.domain.TrainingModule;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TrainingModuleRepository extends MongoRepository<TrainingModule, String> {

}
