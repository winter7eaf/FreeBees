package uk.ac.bham.teamproject.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A RateRecord.
 */
@Entity
@Table(name = "rate_record")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class RateRecord implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Min(value = 0)
    @Max(value = 11)
    @Column(name = "rate_value", nullable = false)
    private Integer rateValue;

    @ManyToOne(optional = false)
    @NotNull
    private User rater;

    @ManyToOne(optional = false)
    @NotNull
    private User ratee;

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties(value = { "rateToGiver", "rateToReceiver", "giver", "receiver", "item" }, allowSetters = true)
    private Handoff handoffRef;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public RateRecord id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getRateValue() {
        return this.rateValue;
    }

    public RateRecord rateValue(Integer rateValue) {
        this.setRateValue(rateValue);
        return this;
    }

    public void setRateValue(Integer rateValue) {
        this.rateValue = rateValue;
    }

    public User getRater() {
        return this.rater;
    }

    public void setRater(User user) {
        this.rater = user;
    }

    public RateRecord rater(User user) {
        this.setRater(user);
        return this;
    }

    public User getRatee() {
        return this.ratee;
    }

    public void setRatee(User user) {
        this.ratee = user;
    }

    public RateRecord ratee(User user) {
        this.setRatee(user);
        return this;
    }

    public Handoff getHandoffRef() {
        return this.handoffRef;
    }

    public void setHandoffRef(Handoff handoff) {
        this.handoffRef = handoff;
    }

    public RateRecord handoffRef(Handoff handoff) {
        this.setHandoffRef(handoff);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof RateRecord)) {
            return false;
        }
        return id != null && id.equals(((RateRecord) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "RateRecord{" +
            "id=" + getId() +
            ", rateValue=" + getRateValue() +
            "}";
    }
}
