package lt.vtvpmc.ems.isveikata.prescriptionUsage;


import lombok.Data;
import lt.vtvpmc.ems.isveikata.employees.Druggist;
import lt.vtvpmc.ems.isveikata.prescription.Prescription;
import org.hibernate.annotations.Type;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Date;

@Entity
@Data
public class PrescriptionUsage implements Serializable {
	private static final long serialVersionUID = -1356539984293281290L;

	@Id
    @GeneratedValue
    private long id;

    @ManyToOne
    private Prescription prescription;

    @ManyToOne
    private Druggist druggist;

    @Type(type = "date")
    private Date usageDate;

}