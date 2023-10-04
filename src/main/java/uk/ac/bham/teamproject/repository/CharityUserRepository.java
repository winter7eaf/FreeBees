package uk.ac.bham.teamproject.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import uk.ac.bham.teamproject.domain.CharityUser;

/**
 * Spring Data JPA repository for the CharityUser entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CharityUserRepository extends JpaRepository<CharityUser, Long> {}
