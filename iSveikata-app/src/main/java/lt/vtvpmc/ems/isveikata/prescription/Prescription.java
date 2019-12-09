package lt.vtvpmc.ems.isveikata.prescription;


import java.io.Serializable;
import java.util.Date;
import java.util.List;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Index;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import org.hibernate.annotations.Type;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.Data;
import lt.vtvpmc.ems.isveikata.api.Api;
import lt.vtvpmc.ems.isveikata.employees.Doctor;
import lt.vtvpmc.ems.isveikata.patient.Patient;
import lt.vtvpmc.ems.isveikata.prescriptionUsage.PrescriptionUsage;

@Entity
@Data
@Table(indexes = {
		@Index(name = "idx_api", columnList = "api_id")
		})
public class Prescription implements Serializable {
	private static final long serialVersionUID = -3936968052423037625L;

	@Id
    @GeneratedValue
    private long id;

    @Type(type = "date")
    private Date expirationDate;

    @Type(type = "date")
    private Date prescriptionDate;

    @ManyToOne
    private Patient patient;

    @ManyToOne
    private Doctor doctor;

    @ManyToOne
    private Api api;

    @JsonIgnore
    @OneToMany(mappedBy = "prescription")
    private List<PrescriptionUsage> prescriptionUsage;

    private double ingredientAmount;
    private String description;
    private long useAmount;
	public void addUsage() {
		useAmount++;
	}

}
