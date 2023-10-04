package uk.ac.bham.teamproject.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import uk.ac.bham.teamproject.domain.ItemImage;

/**
 * Spring Data JPA repository for the ItemImage entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ItemImageRepository extends JpaRepository<ItemImage, Long> {}
