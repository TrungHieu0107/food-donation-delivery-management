export class ReportModel {
	id: string
	title: string
	content: string
	createdDate: string
	type: string

	constructor(value: Partial<ReportModel>) {
		this.id = value.id || ''
		this.title = value.title || ''
		this.content = value.content || ''
		this.createdDate = value.createdDate || ''
		this.type = value.type || ''
	}
}
