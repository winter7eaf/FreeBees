package uk.ac.bham.teamproject.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.ZonedDateTime;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import uk.ac.bham.teamproject.domain.enumeration.RequestState;
import uk.ac.bham.teamproject.domain.enumeration.RequestType;

/**
 * A Request.
 */
@Entity
@Table(name = "request")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Request implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false)
    private RequestType type;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "state", nullable = false)
    private RequestState state;

    @NotNull
    @Column(name = "sent_time", nullable = false)
    private ZonedDateTime sentTime;

    @NotNull
    @Column(name = "expiry_time", nullable = false)
    private ZonedDateTime expiryTime;

    @Column(name = "response_time")
    private ZonedDateTime responseTime;

    @ManyToOne(optional = false)
    @NotNull
    private User requester;

    @ManyToOne(optional = false)
    @NotNull
    private User requestee;

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties(value = { "giver", "receiver", "tags", "images", "requests", "handoffs" }, allowSetters = true)
    private Item item;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Request id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public RequestType getType() {
        return this.type;
    }

    public Request type(RequestType type) {
        this.setType(type);
        return this;
    }

    public void setType(RequestType type) {
        this.type = type;
    }

    public RequestState getState() {
        return this.state;
    }

    public Request state(RequestState state) {
        this.setState(state);
        return this;
    }

    public void setState(RequestState state) {
        this.state = state;
    }

    public ZonedDateTime getSentTime() {
        return this.sentTime;
    }

    public Request sentTime(ZonedDateTime sentTime) {
        this.setSentTime(sentTime);
        return this;
    }

    public void setSentTime(ZonedDateTime sentTime) {
        this.sentTime = sentTime;
    }

    public ZonedDateTime getExpiryTime() {
        return this.expiryTime;
    }

    public Request expiryTime(ZonedDateTime expiryTime) {
        this.setExpiryTime(expiryTime);
        return this;
    }

    public void setExpiryTime(ZonedDateTime expiryTime) {
        this.expiryTime = expiryTime;
    }

    public ZonedDateTime getResponseTime() {
        return this.responseTime;
    }

    public Request responseTime(ZonedDateTime responseTime) {
        this.setResponseTime(responseTime);
        return this;
    }

    public void setResponseTime(ZonedDateTime responseTime) {
        this.responseTime = responseTime;
    }

    public User getRequester() {
        return this.requester;
    }

    public void setRequester(User user) {
        this.requester = user;
    }

    public Request requester(User user) {
        this.setRequester(user);
        return this;
    }

    public User getRequestee() {
        return this.requestee;
    }

    public void setRequestee(User user) {
        this.requestee = user;
    }

    public Request requestee(User user) {
        this.setRequestee(user);
        return this;
    }

    public Item getItem() {
        return this.item;
    }

    public void setItem(Item item) {
        this.item = item;
    }

    public Request item(Item item) {
        this.setItem(item);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Request)) {
            return false;
        }
        return id != null && id.equals(((Request) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Request{" +
            "id=" + getId() +
            ", type='" + getType() + "'" +
            ", state='" + getState() + "'" +
            ", sentTime='" + getSentTime() + "'" +
            ", expiryTime='" + getExpiryTime() + "'" +
            ", responseTime='" + getResponseTime() + "'" +
            "}";
    }
}
