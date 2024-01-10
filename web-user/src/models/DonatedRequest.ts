import { ItemTemplateResponse } from './Activity'
import { ScheduledTime, SimpleBranchResponse } from './AidRequest'

export class DonatedRequestModel {
	id?: string
	address?: string
	location?: [number, number]
	createdDate?: string
	acceptedDate?: string
	scheduledTimes?: ScheduledTime[]
	status?: string
	simpleBranchResponse?: SimpleBranchResponse
	simpleActivityResponse?: any

	constructor(value: Partial<DonatedRequestModel>) {
		Object.assign(this, value)
	}
}

export class DonatedRequestDetailModel {
    id?: string;
    address?: string;
    location?: number[];
    images?: string[];
    isConfirmable?: boolean;
    createdDate?: string;
    acceptedDate?: string;
    scheduledTimes?: ScheduledTime[];
    status?: string;
    note?: string | null;
    acceptedBranch?: string | null;
    donatedItemResponses?: DonatedItemResponse[];
    simpleUserResponse?: SimpleUserResponse;
    simpleActivityResponse?: any 
	rejectingBranchResponses?: RejectingBranchResponses[]

    constructor(data: Partial<DonatedRequestDetailModel>) {
       Object.assign(this, data)
    }
}

export  class DonatedItemResponse {
	id?: string
	quantity?: number
	importedQuantity?: number
	initialExpirationDate?: string
	status?: string
	image?: string
	itemTemplateResponse?: ItemTemplateResponse

	constructor(data: Partial<DonatedItemResponse>) {
		Object.assign(this, data)
	}
}


class SimpleUserResponse {
	id?: string
	fullName?: string
	avatar?: string
	role?: string
	phone?: string
	email?: string
	status?: string

	constructor(data: Partial<SimpleUserResponse>) {
		Object.assign(this, data)
	}
}

class RejectingBranchResponses {
	id?: string
	name?: string
	address?: string
	image?: string	
	rejectingReason?: string
	status?: string
	createdDate?: string

	constructor(data: Partial<RejectingBranchResponses>) {
		Object.assign(this, data)
	}
}

// Example usage:
// let mainData = new MainData(yourDataHere);

