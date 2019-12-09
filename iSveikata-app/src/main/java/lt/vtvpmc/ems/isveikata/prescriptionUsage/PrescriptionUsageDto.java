package lt.vtvpmc.ems.isveikata.prescriptionUsage;

import java.util.Date;

import lombok.Data;
import lt.vtvpmc.ems.isveikata.employees.Druggist;
import lt.vtvpmc.ems.isveikata.prescription.PrescriptionDto;

@Data
public class PrescriptionUsageDto {


    private String druggistFullName;

    private Date usageDate;
}
