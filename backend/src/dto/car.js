export class CarDTO {
	constructor(car) {
		this._id = car._id,
		this.category = car.category,
		this.model = car.model,
		this.make = car.make,
		this.year = car.year,
		this.color = car.color,
		this.image = car.image,
		this.registrationNo = car.registrationNo
        this.description = car.description
	}
}

  
  