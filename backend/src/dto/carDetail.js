export class CarDetailsDTO {
	constructor(carDetail) {
		this._id = carDetail._id
		this.make = carDetail.make
		this.model = carDetail.model
		this.color = carDetail.color
		this.registrationNo = carDetail.registrationNo
		this.image = carDetail.image
        this.year = carDetail.year
        this.description = carDetail.description
		this.createdAt = carDetail.createdAt
		this.categoryId = carDetail.category._id
		this.ownerName = carDetail.owner.name
	}
}