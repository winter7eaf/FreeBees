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
import uk.ac.bham.teamproject.domain.RateRecord;
import uk.ac.bham.teamproject.repository.RateRecordRepository;
import uk.ac.bham.teamproject.web.rest.errors.BadRequestAlertException;

/**
 * REST controller for managing {@link uk.ac.bham.teamproject.domain.RateRecord}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class RateRecordResource {

    private final Logger log = LoggerFactory.getLogger(RateRecordResource.class);

    private static final String ENTITY_NAME = "rateRecord";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final RateRecordRepository rateRecordRepository;

    public RateRecordResource(RateRecordRepository rateRecordRepository) {
        this.rateRecordRepository = rateRecordRepository;
    }

    /**
     * {@code POST  /rate-records} : Create a new rateRecord.
     *
     * @param rateRecord the rateRecord to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new rateRecord, or with status {@code 400 (Bad Request)} if the rateRecord has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/rate-records")
    public ResponseEntity<RateRecord> createRateRecord(@Valid @RequestBody RateRecord rateRecord) throws URISyntaxException {
        log.debug("REST request to save RateRecord : {}", rateRecord);
        if (rateRecord.getId() != null) {
            throw new BadRequestAlertException("A new rateRecord cannot already have an ID", ENTITY_NAME, "idexists");
        }
        RateRecord result = rateRecordRepository.save(rateRecord);
        return ResponseEntity
            .created(new URI("/api/rate-records/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /rate-records/:id} : Updates an existing rateRecord.
     *
     * @param id the id of the rateRecord to save.
     * @param rateRecord the rateRecord to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated rateRecord,
     * or with status {@code 400 (Bad Request)} if the rateRecord is not valid,
     * or with status {@code 500 (Internal Server Error)} if the rateRecord couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/rate-records/{id}")
    public ResponseEntity<RateRecord> updateRateRecord(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody RateRecord rateRecord
    ) throws URISyntaxException {
        log.debug("REST request to update RateRecord : {}, {}", id, rateRecord);
        if (rateRecord.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, rateRecord.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!rateRecordRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        RateRecord result = rateRecordRepository.save(rateRecord);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, rateRecord.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /rate-records/:id} : Partial updates given fields of an existing rateRecord, field will ignore if it is null
     *
     * @param id the id of the rateRecord to save.
     * @param rateRecord the rateRecord to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated rateRecord,
     * or with status {@code 400 (Bad Request)} if the rateRecord is not valid,
     * or with status {@code 404 (Not Found)} if the rateRecord is not found,
     * or with status {@code 500 (Internal Server Error)} if the rateRecord couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/rate-records/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<RateRecord> partialUpdateRateRecord(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody RateRecord rateRecord
    ) throws URISyntaxException {
        log.debug("REST request to partial update RateRecord partially : {}, {}", id, rateRecord);
        if (rateRecord.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, rateRecord.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!rateRecordRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<RateRecord> result = rateRecordRepository
            .findById(rateRecord.getId())
            .map(existingRateRecord -> {
                if (rateRecord.getRateValue() != null) {
                    existingRateRecord.setRateValue(rateRecord.getRateValue());
                }

                return existingRateRecord;
            })
            .map(rateRecordRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, rateRecord.getId().toString())
        );
    }

    /**
     * {@code GET  /rate-records} : get all the rateRecords.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of rateRecords in body.
     */
    @GetMapping("/rate-records")
    public List<RateRecord> getAllRateRecords(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all RateRecords");
        if (eagerload) {
            return rateRecordRepository.findAllWithEagerRelationships();
        } else {
            return rateRecordRepository.findAll();
        }
    }

    /**
     * {@code GET  /rate-records/:id} : get the "id" rateRecord.
     *
     * @param id the id of the rateRecord to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the rateRecord, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/rate-records/{id}")
    public ResponseEntity<RateRecord> getRateRecord(@PathVariable Long id) {
        log.debug("REST request to get RateRecord : {}", id);
        Optional<RateRecord> rateRecord = rateRecordRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(rateRecord);
    }

    /**
     * {@code DELETE  /rate-records/:id} : delete the "id" rateRecord.
     *
     * @param id the id of the rateRecord to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/rate-records/{id}")
    public ResponseEntity<Void> deleteRateRecord(@PathVariable Long id) {
        log.debug("REST request to delete RateRecord : {}", id);
        rateRecordRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
