package lt.vtvpmc.ems.isveikata.mappers;

import java.util.List;

import org.mapstruct.InheritConfiguration;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;

import lt.vtvpmc.ems.isveikata.employees.Doctor;
import lt.vtvpmc.ems.isveikata.employees.DoctorDto;

@Mapper(componentModel = "spring", uses = SpecializationMapper.class)
public interface DoctorMapper {
	
	@Mappings({ 
		@Mapping(target = "fullName", expression = "java(doctor.getFirstName() + \" \" + doctor.getLastName())"),
		@Mapping(target = "specialization", source="specialization.title")})
	DoctorDto doctorToDto(Doctor doctor);
	
	@InheritConfiguration
	List<DoctorDto> doctorsToDto(List<Doctor> doctors);
}
