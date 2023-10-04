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
import uk.ac.bham.teamproject.domain.UserRate;
import uk.ac.bham.teamproject.repository.UserRateRepository;
import uk.ac.bham.teamproject.web.rest.errors.BadRequestAlertException;

/**
 * REST controller for managing {@link uk.ac.bham.teamproject.domain.UserRate}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class UserRateResource {

    private final Logger log = LoggerFactory.getLogger(UserRateResource.class);

    private static final String ENTITY_NAME = "userRate";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final UserRateRepository userRateRepository;

    public UserRateResource(UserRateRepository userRateRepository) {
        this.userRateRepository = userRateRepository;
    }

    /**
     * {@code POST  /user-rates} : Create a new userRate.
     *
     * @param userRate the userRate to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new userRate, or with status {@code 400 (Bad Request)} if the userRate has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/user-rates")
    public ResponseEntity<UserRate> createUserRate(@Valid @RequestBody UserRate userRate) throws URISyntaxException {
        log.debug("REST request to save UserRate : {}", userRate);
        if (userRate.getId() != null) {
            throw new BadRequestAlertException("A new userRate cannot already have an ID", ENTITY_NAME, "idexists");
        }
        UserRate result = userRateRepository.save(userRate);
        return ResponseEntity
            .created(new URI("/api/user-rates/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /user-rates/:id} : Updates an existing userRate.
     *
     * @param id the id of the userRate to save.
     * @param userRate the userRate to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated userRate,
     * or with status {@code 400 (Bad Request)} if the userRate is not valid,
     * or with status {@code 500 (Internal Server Error)} if the userRate couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/user-rates/{id}")
    public ResponseEntity<UserRate> updateUserRate(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody UserRate userRate
    ) throws URISyntaxException {
        log.debug("REST request to update UserRate : {}, {}", id, userRate);
        if (userRate.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, userRate.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!userRateRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        UserRate result = userRateRepository.save(userRate);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, userRate.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /user-rates/:id} : Partial updates given fields of an existing userRate, field will ignore if it is null
     *
     * @param id the id of the userRate to save.
     * @param userRate the userRate to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated userRate,
     * or with status {@code 400 (Bad Request)} if the userRate is not valid,
     * or with status {@code 404 (Not Found)} if the userRate is not found,
     * or with status {@code 500 (Internal Server Error)} if the userRate couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/user-rates/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<UserRate> partialUpdateUserRate(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody UserRate userRate
    ) throws URISyntaxException {
        log.debug("REST request to partial update UserRate partially : {}, {}", id, userRate);
        if (userRate.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, userRate.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!userRateRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<UserRate> result = userRateRepository
            .findById(userRate.getId())
            .map(existingUserRate -> {
                if (userRate.getRateAsGiver() != null) {
                    existingUserRate.setRateAsGiver(userRate.getRateAsGiver());
                }
                if (userRate.getRateAsReceiver() != null) {
                    existingUserRate.setRateAsReceiver(userRate.getRateAsReceiver());
                }

                return existingUserRate;
            })
            .map(userRateRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, userRate.getId().toString())
        );
    }

    /**
     * {@code GET  /user-rates} : get all the userRates.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of userRates in body.
     */
    @GetMapping("/user-rates")
    public List<UserRate> getAllUserRates(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all UserRates");
        if (eagerload) {
            return userRateRepository.findAllWithEagerRelationships();
        } else {
            return userRateRepository.findAll();
        }
    }

    /**
     * {@code GET  /user-rates/:id} : get the "id" userRate.
     *
     * @param id the id of the userRate to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the userRate, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/user-rates/{id}")
    public ResponseEntity<UserRate> getUserRate(@PathVariable Long id) {
        log.debug("REST request to get UserRate : {}", id);
        Optional<UserRate> userRate = userRateRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(userRate);
    }

    /**
     * {@code DELETE  /user-rates/:id} : delete the "id" userRate.
     *
     * @param id the id of the userRate to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/user-rates/{id}")
    public ResponseEntity<Void> deleteUserRate(@PathVariable Long id) {
        log.debug("REST request to delete UserRate : {}", id);
        userRateRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
