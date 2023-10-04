package uk.ac.bham.teamproject.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import uk.ac.bham.teamproject.domain.RateRecord;

/**
 * Spring Data JPA repository for the RateRecord entity.
 */
@Repository
public interface RateRecordRepository extends JpaRepository<RateRecord, Long> {
    @Query("select rateRecord from RateRecord rateRecord where rateRecord.rater.login = ?#{principal.username}")
    List<RateRecord> findByRaterIsCurrentUser();

    @Query("select rateRecord from RateRecord rateRecord where rateRecord.ratee.login = ?#{principal.username}")
    List<RateRecord> findByRateeIsCurrentUser();

    default Optional<RateRecord> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<RateRecord> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<RateRecord> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select distinct rateRecord from RateRecord rateRecord left join fetch rateRecord.rater left join fetch rateRecord.ratee",
        countQuery = "select count(distinct rateRecord) from RateRecord rateRecord"
    )
    Page<RateRecord> findAllWithToOneRelationships(Pageable pageable);

    @Query("select distinct rateRecord from RateRecord rateRecord left join fetch rateRecord.rater left join fetch rateRecord.ratee")
    List<RateRecord> findAllWithToOneRelationships();

    @Query(
        "select rateRecord from RateRecord rateRecord left join fetch rateRecord.rater left join fetch rateRecord.ratee where rateRecord.id =:id"
    )
    Optional<RateRecord> findOneWithToOneRelationships(@Param("id") Long id);
}
