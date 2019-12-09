package lt.vtvpmc.ems.isveikata.mappers;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;

import lt.vtvpmc.ems.isveikata.patient.Patient;
import lt.vtvpmc.ems.isveikata.patient.PatientDto;

@Mapper(componentModel = "spring")
public interface PatientMapper {
	
	@Mappings({
		@Mapping(target = "fullName", expression = "java(patient.getFirstName() + \" \" + patient.getLastName())"),
		@Mapping(target = "id", source = "patientId")
	})
	PatientDto patientToDto(Patient patient);
	
	List<PatientDto> patiensToDto(List<Patient> patients);
	
}
