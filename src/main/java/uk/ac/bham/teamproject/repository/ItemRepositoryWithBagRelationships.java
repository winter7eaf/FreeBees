package uk.ac.bham.teamproject.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import uk.ac.bham.teamproject.domain.Item;

public interface ItemRepositoryWithBagRelationships {
    Optional<Item> fetchBagRelationships(Optional<Item> item);

    List<Item> fetchBagRelationships(List<Item> items);

    Page<Item> fetchBagRelationships(Page<Item> items);
}
