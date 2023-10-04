package uk.ac.bham.teamproject.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.ZonedDateTime;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import uk.ac.bham.teamproject.domain.enumeration.HandoffState;

/**
 * A Handoff.
 */
@Entity
@Table(name = "handoff")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Handoff implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "state", nullable = false)
    private HandoffState state;

    @NotNull
    @Column(name = "start_time", nullable = false)
    private ZonedDateTime startTime;

    @Column(name = "end_time")
    private ZonedDateTime endTime;

    @JsonIgnoreProperties(value = { "rater", "ratee", "handoffRef" }, allowSetters = true)
    @OneToOne(optional = false)
    @NotNull
    @JoinColumn(unique = true)
    private RateRecord rateToGiver;

    @JsonIgnoreProperties(value = { "rater", "ratee", "handoffRef" }, allowSetters = true)
    @OneToOne(optional = false)
    @NotNull
    @JoinColumn(unique = true)
    private RateRecord rateToReceiver;

    @ManyToOne(optional = false)
    @NotNull
    private User giver;

    @ManyToOne(optional = false)
    @NotNull
    private User receiver;

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties(value = { "giver", "receiver", "tags", "images", "requests", "handoffs" }, allowSetters = true)
    private Item item;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Handoff id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public HandoffState getState() {
        return this.state;
    }

    public Handoff state(HandoffState state) {
        this.setState(state);
        return this;
    }

    public void setState(HandoffState state) {
        this.state = state;
    }

    public ZonedDateTime getStartTime() {
        return this.startTime;
    }

    public Handoff startTime(ZonedDateTime startTime) {
        this.setStartTime(startTime);
        return this;
    }

    public void setStartTime(ZonedDateTime startTime) {
        this.startTime = startTime;
    }

    public ZonedDateTime getEndTime() {
        return this.endTime;
    }

    public Handoff endTime(ZonedDateTime endTime) {
        this.setEndTime(endTime);
        return this;
    }

    public void setEndTime(ZonedDateTime endTime) {
        this.endTime = endTime;
    }

    public RateRecord getRateToGiver() {
        return this.rateToGiver;
    }

    public void setRateToGiver(RateRecord rateRecord) {
        this.rateToGiver = rateRecord;
    }

    public Handoff rateToGiver(RateRecord rateRecord) {
        this.setRateToGiver(rateRecord);
        return this;
    }

    public RateRecord getRateToReceiver() {
        return this.rateToReceiver;
    }

    public void setRateToReceiver(RateRecord rateRecord) {
        this.rateToReceiver = rateRecord;
    }

    public Handoff rateToReceiver(RateRecord rateRecord) {
        this.setRateToReceiver(rateRecord);
        return this;
    }

    public User getGiver() {
        return this.giver;
    }

    public void setGiver(User user) {
        this.giver = user;
    }

    public Handoff giver(User user) {
        this.setGiver(user);
        return this;
    }

    public User getReceiver() {
        return this.receiver;
    }

    public void setReceiver(User user) {
        this.receiver = user;
    }

    public Handoff receiver(User user) {
        this.setReceiver(user);
        return this;
    }

    public Item getItem() {
        return this.item;
    }

    public void setItem(Item item) {
        this.item = item;
    }

    public Handoff item(Item item) {
        this.setItem(item);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Handoff)) {
            return false;
        }
        return id != null && id.equals(((Handoff) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Handoff{" +
            "id=" + getId() +
            ", state='" + getState() + "'" +
            ", startTime='" + getStartTime() + "'" +
            ", endTime='" + getEndTime() + "'" +
            "}";
    }
}
