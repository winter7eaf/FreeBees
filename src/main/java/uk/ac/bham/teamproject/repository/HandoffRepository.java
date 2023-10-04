package uk.ac.bham.teamproject.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import uk.ac.bham.teamproject.domain.Handoff;

/**
 * Spring Data JPA repository for the Handoff entity.
 */
@Repository
public interface HandoffRepository extends JpaRepository<Handoff, Long> {
    @Query("select handoff from Handoff handoff where handoff.giver.login = ?#{principal.username}")
    List<Handoff> findByGiverIsCurrentUser();

    @Query("select handoff from Handoff handoff where handoff.receiver.login = ?#{principal.username}")
    List<Handoff> findByReceiverIsCurrentUser();

    default Optional<Handoff> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<Handoff> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<Handoff> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select distinct handoff from Handoff handoff left join fetch handoff.giver left join fetch handoff.receiver",
        countQuery = "select count(distinct handoff) from Handoff handoff"
    )
    Page<Handoff> findAllWithToOneRelationships(Pageable pageable);

    @Query("select distinct handoff from Handoff handoff left join fetch handoff.giver left join fetch handoff.receiver")
    List<Handoff> findAllWithToOneRelationships();

    @Query("select handoff from Handoff handoff left join fetch handoff.giver left join fetch handoff.receiver where handoff.id =:id")
    Optional<Handoff> findOneWithToOneRelationships(@Param("id") Long id);
}
