package lt.vtvpmc.ems.isveikata.employees;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;

import lombok.EqualsAndHashCode;

@Entity
@EqualsAndHashCode(callSuper = true)
@DiscriminatorValue(value = "admin")
public class Admin extends Employee {

	public Admin(String name, String surname, String username,String password) {
		super(name, surname, username, password);
	}

	public Admin() {
		super();
	}
}
