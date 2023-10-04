package uk.ac.bham.teamproject.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;
import uk.ac.bham.teamproject.domain.CharityUser;
import uk.ac.bham.teamproject.repository.CharityUserRepository;
import uk.ac.bham.teamproject.web.rest.errors.BadRequestAlertException;

/**
 * REST controller for managing {@link uk.ac.bham.teamproject.domain.CharityUser}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class CharityUserResource {

    private final Logger log = LoggerFactory.getLogger(CharityUserResource.class);

    private static final String ENTITY_NAME = "charityUser";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final CharityUserRepository charityUserRepository;

    public CharityUserResource(CharityUserRepository charityUserRepository) {
        this.charityUserRepository = charityUserRepository;
    }

    /**
     * {@code POST  /charity-users} : Create a new charityUser.
     *
     * @param charityUser the charityUser to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new charityUser, or with status {@code 400 (Bad Request)} if the charityUser has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/charity-users")
    public ResponseEntity<CharityUser> createCharityUser(@RequestBody CharityUser charityUser) throws URISyntaxException {
        log.debug("REST request to save CharityUser : {}", charityUser);
        if (charityUser.getId() != null) {
            throw new BadRequestAlertException("A new charityUser cannot already have an ID", ENTITY_NAME, "idexists");
        }
        CharityUser result = charityUserRepository.save(charityUser);
        return ResponseEntity
            .created(new URI("/api/charity-users/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /charity-users/:id} : Updates an existing charityUser.
     *
     * @param id the id of the charityUser to save.
     * @param charityUser the charityUser to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated charityUser,
     * or with status {@code 400 (Bad Request)} if the charityUser is not valid,
     * or with status {@code 500 (Internal Server Error)} if the charityUser couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/charity-users/{id}")
    public ResponseEntity<CharityUser> updateCharityUser(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody CharityUser charityUser
    ) throws URISyntaxException {
        log.debug("REST request to update CharityUser : {}, {}", id, charityUser);
        if (charityUser.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, charityUser.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!charityUserRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        CharityUser result = charityUserRepository.save(charityUser);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, charityUser.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /charity-users/:id} : Partial updates given fields of an existing charityUser, field will ignore if it is null
     *
     * @param id the id of the charityUser to save.
     * @param charityUser the charityUser to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated charityUser,
     * or with status {@code 400 (Bad Request)} if the charityUser is not valid,
     * or with status {@code 404 (Not Found)} if the charityUser is not found,
     * or with status {@code 500 (Internal Server Error)} if the charityUser couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/charity-users/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<CharityUser> partialUpdateCharityUser(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody CharityUser charityUser
    ) throws URISyntaxException {
        log.debug("REST request to partial update CharityUser partially : {}, {}", id, charityUser);
        if (charityUser.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, charityUser.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!charityUserRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<CharityUser> result = charityUserRepository
            .findById(charityUser.getId())
            .map(existingCharityUser -> {
                if (charityUser.getCharityName() != null) {
                    existingCharityUser.setCharityName(charityUser.getCharityName());
                }
                if (charityUser.getDescription() != null) {
                    existingCharityUser.setDescription(charityUser.getDescription());
                }
                if (charityUser.getLogoURL() != null) {
                    existingCharityUser.setLogoURL(charityUser.getLogoURL());
                }
                if (charityUser.getWebsite() != null) {
                    existingCharityUser.setWebsite(charityUser.getWebsite());
                }

                return existingCharityUser;
            })
            .map(charityUserRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, charityUser.getId().toString())
        );
    }

    /**
     * {@code GET  /charity-users} : get all the charityUsers.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of charityUsers in body.
     */
    @GetMapping("/charity-users")
    public List<CharityUser> getAllCharityUsers() {
        log.debug("REST request to get all CharityUsers");
        return charityUserRepository.findAll();
    }

    /**
     * {@code GET  /charity-users/:id} : get the "id" charityUser.
     *
     * @param id the id of the charityUser to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the charityUser, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/charity-users/{id}")
    public ResponseEntity<CharityUser> getCharityUser(@PathVariable Long id) {
        log.debug("REST request to get CharityUser : {}", id);
        Optional<CharityUser> charityUser = charityUserRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(charityUser);
    }

    /**
     * {@code DELETE  /charity-users/:id} : delete the "id" charityUser.
     *
     * @param id the id of the charityUser to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/charity-users/{id}")
    public ResponseEntity<Void> deleteCharityUser(@PathVariable Long id) {
        log.debug("REST request to delete CharityUser : {}", id);
        charityUserRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
