let mockDelay;
let mockError;
let mockResponse = {
	get: jest.fn(),
	ok: true,
	status: 200,
	toError: jest.fn(),
};

let mockResponseBodies;
let responseBodiesIndex;

const request = function() {
	return Request;
}

const Request = {
	__setMockDelay(boolValue) {
		mockDelay = boolValue;
	},
	__setMockError(mockErr) {
		mockError = mockErr;
	},
	__setMockResponse(mockRes) {
		mockResponse = mockRes;
	},
	__setMockResponseBodies(bodies) {
		mockResponseBodies = bodies;
		responseBodiesIndex = -1;
	},
	__setMockResponseBody(body) {
		mockResponse.body = body;
		responseBodiesIndex = undefined;
	},
	getMockResponse: () => {
		return mockResponse;
	},
	header: jest.fn().mockReturnThis(),
	accept: jest.fn().mockReturnThis(),
	catch: jest.fn().mockReturnThis(),
	delete: jest.fn().mockReturnThis(),
	end: jest.fn().mockImplementation(callback => {
		if (typeof responseBodiesIndex !== 'undefined') {
			responseBodiesIndex += 1;
			mockResponse.body = mockResponseBodies[responseBodiesIndex];
		}

		if (mockDelay) {
			this.delayTimer = setTimeout(() => {
				callback(mockError, mockResponse);
			}, 0);

			return;
		}

		callback(mockError, mockResponse);
	}),
	field: jest.fn().mockReturnThis(),
	get: jest.fn().mockReturnThis(),
	head: jest.fn().mockReturnThis(),
	patch: jest.fn().mockReturnThis(),
	post: jest.fn().mockReturnThis(),
	put: jest.fn().mockReturnThis(),
	query: jest.fn().mockReturnThis(),
	redirects: jest.fn().mockReturnThis(),
	send: jest.fn().mockReturnThis(),
	set: jest.fn().mockReturnThis(),
	then: callback =>
		new Promise((resolve, reject) => {
			if (typeof responseBodiesIndex !== 'undefined') {
				responseBodiesIndex += 1;
				mockResponse.body = mockResponseBodies[responseBodiesIndex];
			}
			if (mockError) {
				reject(mockError);
			} else {
				resolve(callback(mockResponse));
			}
		}),
	timeout: jest.fn().mockReturnThis(),
	type: jest.fn().mockReturnThis(),
};

request.post = request.get = request.send = request.query = request.field = request.set = request.accept = request.timeout = function(){
	return Request;
};

export default request;