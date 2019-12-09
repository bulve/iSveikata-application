package lt.vtvpmc.ems.isveikata.mappers;

import java.util.List;

import org.mapstruct.InheritConfiguration;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;

import lt.vtvpmc.ems.isveikata.medical_record.MedicalRecord;
import lt.vtvpmc.ems.isveikata.medical_record.MedicalRecordDto;

@Mapper(uses = { DoctorMapper.class} , componentModel = "spring")
public interface MedicalRecordMapper {

	@Mappings({ @Mapping(source = "appointment.date", target = "appointmentDate"),
			@Mapping(source = "appointment.duration", target = "appoitmentDuration"),
			@Mapping(source = "appointment.description", target = "appointmentDescription"),
			@Mapping(source = "icd.icdCode", target = "icdCode"),
			@Mapping(source = "icd.title", target = "icdDescription"),
			@Mapping(target = "doctorFullName", expression="java(medicalRecord.getDoctor().getFirstName() + \" \" + medicalRecord.getDoctor().getLastName())"),
			@Mapping(target = "patientFullName", expression="java(medicalRecord.getPatient().getFirstName() + \" \" + medicalRecord.getPatient().getLastName())")
	})
	MedicalRecordDto medicalRecordToDto(MedicalRecord medicalRecord);

	@InheritConfiguration
	List<MedicalRecordDto> medicalRecordsToDto(List<MedicalRecord> medicalRecords);	

}
