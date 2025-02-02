export class PaginationService {
	constructor(model) {
		this.model = model
	}
  
	async paginate(query, options) {
		const page = Number.parseInt(options.page, 10) || 1
		const limit = Number.parseInt(options.limit, 10) || 10
		const startIndex = (page - 1) * limit
		const endIndex = page * limit
		const total = await this.model.countDocuments(query)
  
		const results = await this.model
			.find(query)
			.sort(options.sort || {})
			.skip(startIndex)
			.limit(limit)
			.populate(options.populate || [])
  
		const pagination = {}
  
		if (endIndex < total) {
			pagination.next = {
				page: page + 1,
				limit,
			}
		}
  
		if (startIndex > 0) {
			pagination.prev = {
				page: page - 1,
				limit,
			}
		}
  
		return {
			success: true,
			count: results.length,
			pagination,
			data: results,
			total,
		}
	}
}
  
  