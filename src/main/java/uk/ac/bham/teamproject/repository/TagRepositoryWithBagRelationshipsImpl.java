package uk.ac.bham.teamproject.repository;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.stream.IntStream;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import org.hibernate.annotations.QueryHints;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import uk.ac.bham.teamproject.domain.Tag;

/**
 * Utility repository to load bag relationships based on https://vladmihalcea.com/hibernate-multiplebagfetchexception/
 */
public class TagRepositoryWithBagRelationshipsImpl implements TagRepositoryWithBagRelationships {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Optional<Tag> fetchBagRelationships(Optional<Tag> tag) {
        return tag.map(this::fetchUsers);
    }

    @Override
    public Page<Tag> fetchBagRelationships(Page<Tag> tags) {
        return new PageImpl<>(fetchBagRelationships(tags.getContent()), tags.getPageable(), tags.getTotalElements());
    }

    @Override
    public List<Tag> fetchBagRelationships(List<Tag> tags) {
        return Optional.of(tags).map(this::fetchUsers).orElse(Collections.emptyList());
    }

    Tag fetchUsers(Tag result) {
        return entityManager
            .createQuery("select tag from Tag tag left join fetch tag.users where tag is :tag", Tag.class)
            .setParameter("tag", result)
            .setHint(QueryHints.PASS_DISTINCT_THROUGH, false)
            .getSingleResult();
    }

    List<Tag> fetchUsers(List<Tag> tags) {
        HashMap<Object, Integer> order = new HashMap<>();
        IntStream.range(0, tags.size()).forEach(index -> order.put(tags.get(index).getId(), index));
        List<Tag> result = entityManager
            .createQuery("select distinct tag from Tag tag left join fetch tag.users where tag in :tags", Tag.class)
            .setParameter("tags", tags)
            .setHint(QueryHints.PASS_DISTINCT_THROUGH, false)
            .getResultList();
        Collections.sort(result, (o1, o2) -> Integer.compare(order.get(o1.getId()), order.get(o2.getId())));
        return result;
    }
}
