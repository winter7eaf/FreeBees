package uk.ac.bham.teamproject.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import uk.ac.bham.teamproject.domain.UserRate;

/**
 * Spring Data JPA repository for the UserRate entity.
 */
@Repository
public interface UserRateRepository extends JpaRepository<UserRate, Long> {
    default Optional<UserRate> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<UserRate> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<UserRate> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select distinct userRate from UserRate userRate left join fetch userRate.user",
        countQuery = "select count(distinct userRate) from UserRate userRate"
    )
    Page<UserRate> findAllWithToOneRelationships(Pageable pageable);

    @Query("select distinct userRate from UserRate userRate left join fetch userRate.user")
    List<UserRate> findAllWithToOneRelationships();

    @Query("select userRate from UserRate userRate left join fetch userRate.user where userRate.id =:id")
    Optional<UserRate> findOneWithToOneRelationships(@Param("id") Long id);
}
