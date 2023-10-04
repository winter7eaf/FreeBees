package uk.ac.bham.teamproject.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import uk.ac.bham.teamproject.domain.Item;

/**
 * Spring Data JPA repository for the Item entity.
 *
 * When extending this class, extend ItemRepositoryWithBagRelationships too.
 * For more information refer to https://github.com/jhipster/generator-jhipster/issues/17990.
 */
@Repository
public interface ItemRepository extends ItemRepositoryWithBagRelationships, JpaRepository<Item, Long> {
    @Query("select item from Item item where item.giver.login = ?#{principal.username}")
    List<Item> findByGiverIsCurrentUser();

    @Query("select item from Item item where item.receiver.login = ?#{principal.username}")
    List<Item> findByReceiverIsCurrentUser();

    default Optional<Item> findOneWithEagerRelationships(Long id) {
        return this.fetchBagRelationships(this.findOneWithToOneRelationships(id));
    }

    default List<Item> findAllWithEagerRelationships() {
        return this.fetchBagRelationships(this.findAllWithToOneRelationships());
    }

    default Page<Item> findAllWithEagerRelationships(Pageable pageable) {
        return this.fetchBagRelationships(this.findAllWithToOneRelationships(pageable));
    }

    @Query(
        value = "select distinct item from Item item left join fetch item.giver left join fetch item.receiver",
        countQuery = "select count(distinct item) from Item item"
    )
    Page<Item> findAllWithToOneRelationships(Pageable pageable);

    @Query("select distinct item from Item item left join fetch item.giver left join fetch item.receiver")
    List<Item> findAllWithToOneRelationships();

    @Query("select item from Item item left join fetch item.giver left join fetch item.receiver where item.id =:id")
    Optional<Item> findOneWithToOneRelationships(@Param("id") Long id);
}
