package lt.vtvpmc.ems.isveikata.mappers;

import java.util.List;

import org.mapstruct.InheritInverseConfiguration;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;

import lt.vtvpmc.ems.isveikata.prescription.Prescription;
import lt.vtvpmc.ems.isveikata.prescription.PrescriptionDto;

@Mapper(componentModel = "spring")
public interface PrescriptionMapper {

	@Mappings({
			@Mapping(source = "ingredientAmount", target = "amount"),
			@Mapping(source = "api.title", target = "apiTitle"),
			@Mapping(source = "api.measurements", target ="apiUnits"),
			@Mapping(target = "doctorFullName", expression = "java(prescription.getDoctor().getFirstName() + \" \" + prescription.getDoctor().getLastName())"),
			@Mapping(target = "patientFullName", expression="java(prescription.getPatient().getFirstName() + \" \" + prescription.getPatient().getLastName())")
	})
	PrescriptionDto prescriptionToDto(Prescription prescription);

	@InheritInverseConfiguration
	Prescription dtoToPrescription(PrescriptionDto prescriptionDto);

	List<PrescriptionDto> prescriptionsToDto(List<Prescription> prescriptions);

}
