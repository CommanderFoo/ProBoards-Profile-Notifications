profile_notifications.data = class {

	constructor(user_id = 0){
		this.user_id = user_id;
		this._DATA = [];
	}

	setup(data = []){
		this._DATA = data;
	}

	get(){
		return this._DATA || [];
	}

	set(data = []){
		this._DATA = data;
	}

	clear(){
		this._DATA = [];
	}

	save(key = null, type = null){
		let promise = profile_notifications.api.key(profile_notifications.PLUGIN_KEY).set(this._DATA || [], this.user_id, type);

		if(promise){
			return promise;
		} else {
			return new Promise((resolve, reject) => {
				reject({
					message: "Key does not exist"
				});
			})
		}
	}

};