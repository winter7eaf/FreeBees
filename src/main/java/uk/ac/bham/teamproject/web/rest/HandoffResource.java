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
import uk.ac.bham.teamproject.domain.Handoff;
import uk.ac.bham.teamproject.repository.HandoffRepository;
import uk.ac.bham.teamproject.web.rest.errors.BadRequestAlertException;

/**
 * REST controller for managing {@link uk.ac.bham.teamproject.domain.Handoff}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class HandoffResource {

    private final Logger log = LoggerFactory.getLogger(HandoffResource.class);

    private static final String ENTITY_NAME = "handoff";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final HandoffRepository handoffRepository;

    public HandoffResource(HandoffRepository handoffRepository) {
        this.handoffRepository = handoffRepository;
    }

    /**
     * {@code POST  /handoffs} : Create a new handoff.
     *
     * @param handoff the handoff to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new handoff, or with status {@code 400 (Bad Request)} if the handoff has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/handoffs")
    public ResponseEntity<Handoff> createHandoff(@Valid @RequestBody Handoff handoff) throws URISyntaxException {
        log.debug("REST request to save Handoff : {}", handoff);
        if (handoff.getId() != null) {
            throw new BadRequestAlertException("A new handoff cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Handoff result = handoffRepository.save(handoff);
        return ResponseEntity
            .created(new URI("/api/handoffs/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /handoffs/:id} : Updates an existing handoff.
     *
     * @param id the id of the handoff to save.
     * @param handoff the handoff to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated handoff,
     * or with status {@code 400 (Bad Request)} if the handoff is not valid,
     * or with status {@code 500 (Internal Server Error)} if the handoff couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/handoffs/{id}")
    public ResponseEntity<Handoff> updateHandoff(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Handoff handoff
    ) throws URISyntaxException {
        log.debug("REST request to update Handoff : {}, {}", id, handoff);
        if (handoff.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, handoff.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!handoffRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Handoff result = handoffRepository.save(handoff);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, handoff.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /handoffs/:id} : Partial updates given fields of an existing handoff, field will ignore if it is null
     *
     * @param id the id of the handoff to save.
     * @param handoff the handoff to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated handoff,
     * or with status {@code 400 (Bad Request)} if the handoff is not valid,
     * or with status {@code 404 (Not Found)} if the handoff is not found,
     * or with status {@code 500 (Internal Server Error)} if the handoff couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/handoffs/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Handoff> partialUpdateHandoff(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Handoff handoff
    ) throws URISyntaxException {
        log.debug("REST request to partial update Handoff partially : {}, {}", id, handoff);
        if (handoff.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, handoff.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!handoffRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Handoff> result = handoffRepository
            .findById(handoff.getId())
            .map(existingHandoff -> {
                if (handoff.getState() != null) {
                    existingHandoff.setState(handoff.getState());
                }
                if (handoff.getStartTime() != null) {
                    existingHandoff.setStartTime(handoff.getStartTime());
                }
                if (handoff.getEndTime() != null) {
                    existingHandoff.setEndTime(handoff.getEndTime());
                }

                return existingHandoff;
            })
            .map(handoffRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, handoff.getId().toString())
        );
    }

    /**
     * {@code GET  /handoffs} : get all the handoffs.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of handoffs in body.
     */
    @GetMapping("/handoffs")
    public List<Handoff> getAllHandoffs(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all Handoffs");
        if (eagerload) {
            return handoffRepository.findAllWithEagerRelationships();
        } else {
            return handoffRepository.findAll();
        }
    }

    /**
     * {@code GET  /handoffs/:id} : get the "id" handoff.
     *
     * @param id the id of the handoff to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the handoff, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/handoffs/{id}")
    public ResponseEntity<Handoff> getHandoff(@PathVariable Long id) {
        log.debug("REST request to get Handoff : {}", id);
        Optional<Handoff> handoff = handoffRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(handoff);
    }

    /**
     * {@code DELETE  /handoffs/:id} : delete the "id" handoff.
     *
     * @param id the id of the handoff to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/handoffs/{id}")
    public ResponseEntity<Void> deleteHandoff(@PathVariable Long id) {
        log.debug("REST request to delete Handoff : {}", id);
        handoffRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
