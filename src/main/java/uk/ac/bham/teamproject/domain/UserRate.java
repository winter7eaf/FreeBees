package uk.ac.bham.teamproject.domain;

import java.io.Serializable;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A UserRate.
 */
@Entity
@Table(name = "user_rate")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class UserRate implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Min(value = 0)
    @Max(value = 10)
    @Column(name = "rate_as_giver", nullable = false)
    private Integer rateAsGiver;

    @NotNull
    @Min(value = 0)
    @Max(value = 10)
    @Column(name = "rate_as_receiver", nullable = false)
    private Integer rateAsReceiver;

    @OneToOne(optional = false)
    @NotNull
    @JoinColumn(unique = true)
    private User user;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public UserRate id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getRateAsGiver() {
        return this.rateAsGiver;
    }

    public UserRate rateAsGiver(Integer rateAsGiver) {
        this.setRateAsGiver(rateAsGiver);
        return this;
    }

    public void setRateAsGiver(Integer rateAsGiver) {
        this.rateAsGiver = rateAsGiver;
    }

    public Integer getRateAsReceiver() {
        return this.rateAsReceiver;
    }

    public UserRate rateAsReceiver(Integer rateAsReceiver) {
        this.setRateAsReceiver(rateAsReceiver);
        return this;
    }

    public void setRateAsReceiver(Integer rateAsReceiver) {
        this.rateAsReceiver = rateAsReceiver;
    }

    public User getUser() {
        return this.user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public UserRate user(User user) {
        this.setUser(user);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof UserRate)) {
            return false;
        }
        return id != null && id.equals(((UserRate) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "UserRate{" +
            "id=" + getId() +
            ", rateAsGiver=" + getRateAsGiver() +
            ", rateAsReceiver=" + getRateAsReceiver() +
            "}";
    }
}
