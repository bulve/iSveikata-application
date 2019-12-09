package lt.vtvpmc.ems.isveikata.appointment;

import java.io.Serializable;
import java.util.Date;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.OneToOne;

import org.hibernate.annotations.Type;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.Data;
import lt.vtvpmc.ems.isveikata.medical_record.MedicalRecord;

@Entity
@Data
public class Appointment implements Serializable {
	private static final long serialVersionUID = -5787787986684616099L;

	@Id
	@GeneratedValue
	private long id;
	
	@Column(length=1024)
	private String description;

	private int duration;
	
	@Type(type = "date")
	private Date date;

	@JsonIgnore
	@OneToOne(mappedBy = "appointment", cascade = CascadeType.ALL, orphanRemoval = true)
	private MedicalRecord medicalRecord;

	// @Transient
	// private static final DateTimeFormatter DTF =
	// DateTimeFormatter.ofPattern("yyyy/MM/dd HH:mm:ss");

}
