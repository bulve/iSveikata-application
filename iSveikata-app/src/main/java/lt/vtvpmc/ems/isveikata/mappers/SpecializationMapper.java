package lt.vtvpmc.ems.isveikata.mappers;

import java.util.List;

import org.mapstruct.Mapper;

import lt.vtvpmc.ems.isveikata.specialization.Specialization;
import lt.vtvpmc.ems.isveikata.specialization.SpecializationDto;

@Mapper(componentModel = "spring") 
public interface SpecializationMapper {

	Specialization dtoToSpecialization(SpecializationDto specializationDto);

	SpecializationDto specializationToDto(Specialization specialization);

	List<SpecializationDto> specializationsToDto(List<Specialization> specializations);
}
