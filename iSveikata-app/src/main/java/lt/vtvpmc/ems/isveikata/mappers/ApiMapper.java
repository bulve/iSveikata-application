package lt.vtvpmc.ems.isveikata.mappers;

import java.util.List;

import org.mapstruct.InheritInverseConfiguration;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;

import lt.vtvpmc.ems.isveikata.api.Api;
import lt.vtvpmc.ems.isveikata.api.ApiDto;

@Mapper(componentModel = "spring")
public interface ApiMapper {

	/**
	 * Converts from apiDto form UI to api for entity.<Br>
	 * source = dto; target - entity
	 * 
	 * @param apiDto
	 *            the api dto
	 * @return the api
	 */
	@Mappings({ @Mapping(source = "ingredientName", target = "title"),
			@Mapping(source = "description", target = "description"),
			@Mapping(source = "unit", target = "measurements"), 
			@Mapping(target = "id", ignore = true) 
	})
	Api dtoToApi(ApiDto apiDto);

	@InheritInverseConfiguration
	ApiDto apiToDto(Api api);

	List<ApiDto> apisToDto(List<Api> apis);

}