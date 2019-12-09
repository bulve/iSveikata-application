package lt.vtvpmc.ems.isveikata.prescription;

import java.util.Date;

import lombok.Data;

@Data
public class PrescriptionDto {

    private Long id;
    private Date expirationDate;
    private Date prescriptionDate;
    private Long amount;
    private String apiTitle;
    private String apiUnits;
    private String description;
    private Long useAmount;
    private String doctorFullName;
    private String patientFullName;
}
