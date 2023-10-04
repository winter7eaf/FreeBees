package uk.ac.bham.teamproject.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import uk.ac.bham.teamproject.domain.Request;
import uk.ac.bham.teamproject.domain.enumeration.RequestState;

/**
 * Spring Data JPA repository for the Request entity.
 */
@Repository
public interface RequestRepository extends JpaRepository<Request, Long> {
    @Query("select request from Request request where request.requester.login = ?#{principal.username}")
    List<Request> findByRequesterIsCurrentUser();

    @Query("select request from Request request where request.requestee.login = ?#{principal.username}")
    List<Request> findByRequesteeIsCurrentUser();

    @Query("select request from Request request where request.requestee.login = ?#{principal.username} and request.state = 'PENDING'")
    List<Request> findByRequesteeIsCurrentUserAndPending();

    @Query(
        "select request from Request request where request.requester.login = ?#{principal.username} or request.requestee.login = ?#{principal.username}"
    )
    List<Request> findByRequesterOrRequesteeIsCurrentUser();

    Optional<Request> findByItemIdAndRequesteeLoginAndStateEquals(Long id, String login, RequestState requestState);

    default Optional<Request> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<Request> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<Request> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select distinct request from Request request left join fetch request.requester left join fetch request.requestee",
        countQuery = "select count(distinct request) from Request request"
    )
    Page<Request> findAllWithToOneRelationships(Pageable pageable);

    @Query("select distinct request from Request request left join fetch request.requester left join fetch request.requestee")
    List<Request> findAllWithToOneRelationships();

    @Query("select request from Request request left join fetch request.requester left join fetch request.requestee where request.id =:id")
    Optional<Request> findOneWithToOneRelationships(@Param("id") Long id);
}
