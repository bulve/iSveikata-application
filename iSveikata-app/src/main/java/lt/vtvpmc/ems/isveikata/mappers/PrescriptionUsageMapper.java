package lt.vtvpmc.ems.isveikata.mappers;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;

import lt.vtvpmc.ems.isveikata.prescriptionUsage.PrescriptionUsage;
import lt.vtvpmc.ems.isveikata.prescriptionUsage.PrescriptionUsageDto;

import java.util.List;

@Mapper(componentModel = "spring", uses = { PrescriptionMapper.class })
public interface PrescriptionUsageMapper {

//	@Mappings({ @Mapping(source = "appointment.date", target = "appointmentDate"),
//			@Mapping(source = "appointment.duration", target = "appoitmentDuration"),
//			@Mapping(source = "appointment.description", target = "appointmentDescription"),
//			@Mapping(source = "icd.icdCode", target = "icdCode"),
//			@Mapping(source = "icd.title", target = "icdDescription"),
//			@Mapping(target = "doctorFullName", expression="java(medicalRecord.getDoctor().getFirstName() + \" \" + medicalRecord.getDoctor().getLastName())"),
//			@Mapping(target = "patientFullName", expression="java(medicalRecord.getPatient().getFirstName() + \" \" + medicalRecord.getPatient().getLastName())")
//	})
	@Mappings({
			@Mapping(target = "druggistFullName", expression = "java(prescriptionUsage.getDruggist().getFirstName() + \" \" + prescriptionUsage.getDruggist().getLastName())"),
	})
	PrescriptionUsageDto prescriptionUsageToDto(PrescriptionUsage prescriptionUsage);

	List<PrescriptionUsageDto> prescriptionUsagesToDto(List<PrescriptionUsage> doctors);

}
