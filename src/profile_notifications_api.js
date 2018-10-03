profile_notifications.api = class {

	static init(){

	}

	static data(user_id = 0){
		let id = parseInt(user_id, 10) || 0;

		if(id > 0){
			if(!profile_notifications.KEY_DATA.get(id)){
				profile_notifications.KEY_DATA.set(id, new profile_notifications.data(id));
			}

			return profile_notifications.KEY_DATA.get(id);
		}

		console.warn("Profile Notifications API: User ID not valid");

		return null;
	}

	static create(user_id = 0){
		let user_data = this.data(user_id);

		if(!user_data){
			return null;
		}

		return {

			notification(message = ""){
				let data = message + "@@" + (+ new Date());
				let p = null;
				let key_obj = profile_notifications.api.key(profile_notifications.PLUGIN_KEY);

				let pruner = new profile_notifications.api.pruner({

					key: key_obj,
					object_id: user_id

				});

				pruner.prune([data]);

				if(pruner.pruned_data().length > 0){
					p = pruner.save();

					let pruned_data = pruner.pruned_data();
					let local_data = localStorage.getItem("pd_profile_notifications");

					if(local_data && profile_notifications.is_json(local_data)){
						let local = JSON.parse(local_data);

						if(Array.isArray(local)){
							let has_changes = false;

							for(let p = 0, pl = pruned_data.length; p < pl; ++ p){
								let notification_id = parseInt(pruned_data[p].split("@@")[1], 10);

								if($.inArrayLoose(notification_id, local) > -1){
									local.splice(p, 1);
									has_changes = true;
								}
							}

							if(has_changes){
								localStorage.setItem("pd_profile_notifications", JSON.stringify(local));
							}
						}
					}
				} else {
					let key_obj = profile_notifications.api.key(profile_notifications.PLUGIN_KEY);

					if(key_obj.is_empty(user_id)){
						p = key_obj.set([data], user_id);
					} else {
						p = key_obj.set(data, user_id, "push");
					}
				}

				p.then(() => profile_notifications.api.refresh_all_data());

				return p;
			}
		}

	}

	static get(user_id = 0){
		let user_data = this.data(user_id);

		if(!user_data){
			return null;
		}

		return {

			notifications(){
				return user_data.get() || [];
			}

		};
	}

	static set(user_id = 0){
		let user_data = this.data(user_id);

		if(!user_data){
			return null;
		}

		return {

			data(data = []){
				user_data.set(data);
			}

		};
	}

	static clear(user_id = 0){
		let user_data = this.data(user_id);

		if(!user_data){
			return null;
		}

		return {

			notifications(){
				localStorage.removeItem("pd_profile_notifications");

				return user_data.clear();
			}

		}
	}

	static save(user_id = 0){
		return new Promise((resolve, reject) => {
			let user_data = this.data(user_id);

			if(user_data){
				user_data.save().then(status => resolve(status)).catch(status => reject(status));
			} else {
				let evt_obj = Object.create(null);

				evt_obj.user_id = user_id;
				evt_obj.message = "No user data";

				reject(evt_obj);
			}
		});
	}

	static refresh_all_data(){
		profile_notifications.setup_data();
	}

};