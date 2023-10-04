package uk.ac.bham.teamproject.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;
import uk.ac.bham.teamproject.domain.ItemImage;
import uk.ac.bham.teamproject.repository.ItemImageRepository;
import uk.ac.bham.teamproject.web.rest.errors.BadRequestAlertException;

/**
 * REST controller for managing {@link uk.ac.bham.teamproject.domain.ItemImage}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ItemImageResource {

    private final Logger log = LoggerFactory.getLogger(ItemImageResource.class);

    private static final String ENTITY_NAME = "itemImage";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ItemImageRepository itemImageRepository;

    public ItemImageResource(ItemImageRepository itemImageRepository) {
        this.itemImageRepository = itemImageRepository;
    }

    /**
     * {@code POST  /item-images} : Create a new itemImage.
     *
     * @param itemImage the itemImage to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new itemImage, or with status {@code 400 (Bad Request)} if the itemImage has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/item-images")
    public ResponseEntity<ItemImage> createItemImage(@Valid @RequestBody ItemImage itemImage) throws URISyntaxException {
        log.debug("REST request to save ItemImage : {}", itemImage);
        if (itemImage.getId() != null) {
            throw new BadRequestAlertException("A new itemImage cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ItemImage result = itemImageRepository.save(itemImage);
        return ResponseEntity
            .created(new URI("/api/item-images/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /item-images/:id} : Updates an existing itemImage.
     *
     * @param id the id of the itemImage to save.
     * @param itemImage the itemImage to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated itemImage,
     * or with status {@code 400 (Bad Request)} if the itemImage is not valid,
     * or with status {@code 500 (Internal Server Error)} if the itemImage couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/item-images/{id}")
    public ResponseEntity<ItemImage> updateItemImage(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody ItemImage itemImage
    ) throws URISyntaxException {
        log.debug("REST request to update ItemImage : {}, {}", id, itemImage);
        if (itemImage.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, itemImage.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!itemImageRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        ItemImage result = itemImageRepository.save(itemImage);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, itemImage.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /item-images/:id} : Partial updates given fields of an existing itemImage, field will ignore if it is null
     *
     * @param id the id of the itemImage to save.
     * @param itemImage the itemImage to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated itemImage,
     * or with status {@code 400 (Bad Request)} if the itemImage is not valid,
     * or with status {@code 404 (Not Found)} if the itemImage is not found,
     * or with status {@code 500 (Internal Server Error)} if the itemImage couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/item-images/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<ItemImage> partialUpdateItemImage(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody ItemImage itemImage
    ) throws URISyntaxException {
        log.debug("REST request to partial update ItemImage partially : {}, {}", id, itemImage);
        if (itemImage.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, itemImage.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!itemImageRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<ItemImage> result = itemImageRepository
            .findById(itemImage.getId())
            .map(existingItemImage -> {
                if (itemImage.getImage() != null) {
                    existingItemImage.setImage(itemImage.getImage());
                }
                if (itemImage.getImageContentType() != null) {
                    existingItemImage.setImageContentType(itemImage.getImageContentType());
                }

                return existingItemImage;
            })
            .map(itemImageRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, itemImage.getId().toString())
        );
    }

    /**
     * {@code GET  /item-images} : get all the itemImages.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of itemImages in body.
     */
    @GetMapping("/item-images")
    public List<ItemImage> getAllItemImages() {
        log.debug("REST request to get all ItemImages");
        return itemImageRepository.findAll();
    }

    /**
     * {@code GET  /item-images/:id} : get the "id" itemImage.
     *
     * @param id the id of the itemImage to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the itemImage, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/item-images/{id}")
    public ResponseEntity<ItemImage> getItemImage(@PathVariable Long id) {
        log.debug("REST request to get ItemImage : {}", id);
        Optional<ItemImage> itemImage = itemImageRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(itemImage);
    }

    /**
     * {@code DELETE  /item-images/:id} : delete the "id" itemImage.
     *
     * @param id the id of the itemImage to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/item-images/{id}")
    public ResponseEntity<Void> deleteItemImage(@PathVariable Long id) {
        log.debug("REST request to delete ItemImage : {}", id);
        itemImageRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
