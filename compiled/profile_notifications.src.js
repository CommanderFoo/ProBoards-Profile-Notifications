class profile_notifications {

	static init(){
		this.version = "1.0.0";

		// Total notifications to show.
		// Ideally this would become a setting in the
		// plugin admin area.

		this.SHOW_AMOUNT = 5;

		this.PLUGIN_KEY = "pd_profile_notifications";
		this.PLUGIN_ID = "pd_profile_notifications";
		this.PLUGIN_VERSION = "1.0.0";
		this.PLUGIN_SETTINGS = null;
		this.PLUGIN_IMAGES = null;
		this.PLUGIN = null;


		this.KEY_DATA = new Map();

		this.ROUTE = pb.data("route");

		this.setup();
		this.setup_data();
		this.api.init();

		profile_notifications_display.init();

		$(this.ready.bind(this));
	}

	static ready(){
		if(this.ROUTE.name == "show_user_notifications"){
			profile_notifications_display.display_list();
		}

		if(this.ROUTE.name.match(/^show_user_/i) || this.ROUTE.name == "user"){
			profile_notifications_display.set_tab_count();
		}

		profile_notifications_display.display_tip();

		// Example code / debug

		/*let user_id = parseInt(pb.data("user").id, 10);

		$("#create-notification").click(() => {

			let msg = "Hi " + (parseInt(localStorage.getItem("nindex"), 10) || 1);

			let p = this.api.create(user_id).notification(msg);

			if(p != null){
				p.then(s => {

					console.log(JSON.stringify(this.api.get(pb.data("user").id).notifications()).length);

				});//.catch(v => console.log(v));
			}

			localStorage.setItem("nindex", (parseInt(localStorage.getItem("nindex"), 10) || 1) + 1);
		});

		$("#get-notifications").click(() => {

			console.log(this.api.get(user_id).notifications());

		});

		$("#clear-notifications").click(() => {


			this.api.clear(user_id).notifications();
			this.api.save(user_id);

		});*/
	}

	static setup(){
		let plugin = pb.plugin.get(this.PLUGIN_ID);

		if(plugin && plugin.settings){
			this.PLUGIN = plugin;
			this.PLUGIN_SETTINGS = plugin.settings;

			if(plugin.images){
				this.PLUGIN_IMAGES = plugin.images;
			}
		}
	}

	static setup_data(){
		let data = proboards.plugin.keys.data[this.PLUGIN_KEY];

		for(let [object_key, value] of Object.entries(data)){
			let id = parseInt(object_key, 10) || 0;

			if(id > 0){
				let user_data = this.KEY_DATA.get(id);

				if(!user_data){
					user_data = new profile_notifications.data(id);
					this.KEY_DATA.set(id, user_data);
				}

				user_data.setup(value);
			}
		}
	}

	static html_encode(str = "", decode_first = false){
		str = (decode_first)? this.html_decode(str) : str;

		return $("<div />").text(str).html();
	}

	static html_decode(str = ""){
		this._textarea.innerHTML = str;

		let val = this._textarea.value;

		this._textarea.innerHTML = "";

		return val;
	}

	static is_json(str = "", return_obj = false){
		try {
			str = JSON.parse(str);
		} catch(e){
			return false;
		}

		if(return_obj){
			return str;
		}

		return true;
	}

	static number_format(str = "", delim = ","){
		return (str.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1" + delim) || "0");
	}

}

class profile_notifications_display {

	static init(){
		this.total_showing = profile_notifications.SHOW_AMOUNT;

		this.notifications = profile_notifications.api.get(parseInt(pb.data("user").id, 10)).notifications().slice().reverse();
	}

	static display_tip(){
		let total_unviewed = this.get_total_unviewed_notifications();

		if(total_unviewed > 0){
			let $link = $("#navigation-menu a[href^=\\/user\\/]");
			let $tip = $link.find(".tip-holder");

			if($tip.length == 0){
				$tip = this.create_tip();
				$link.append($tip);
			}

			let $tip_number = $tip.find(".tip-number");
			let total = total_unviewed;

			if($tip_number.html().match(/(.+?)/)){
				total += parseInt(RegExp.$1.replace(/\D/g, ""), 10);
			}

			$tip_number.html(profile_notifications.number_format(total));

			this.mark_all_viewed();
		}
	}

	static display_list(){
		if(this.notifications && this.notifications.length > 0){
			let $container = this.create_container();
			let $table = this.create_table();

			$table.append(this.create_tbody());

			$container.append($table);

			let $load_more = this.create_load_more();

			if($load_more){
				$container.append($load_more);
			}

			let $existing_box = $(".show-user").find("div.content-box");

			if($existing_box.length > 0){
				$container.insertBefore($existing_box);

				this.create_entries(profile_notifications.SHOW_AMOUNT);
			}
		}
	}

	static create_tip(){
		return $("<div class='tip-holder'><div class='tip-number'></div><span class='tip'></span></div>").on("click", (evt) => {

			location.href = "/user/" + parseInt(pb.data("user").id, 10) + "/notifications";

			evt.preventDefault();

		});

	}
	static create_container(){
		return $("<div class='content-box pd-profile-notifications'><br /></div>");
	}

	static create_table(){
		return $("<table class='notifications list'></table>");
	}

	static create_tbody(){
		return $("<tbody class='notifications-container' id='pd-profile-notifications-list'></tbody>");
	}

	static create_entries(total_to_view){
		let $tbody = $("#pd-profile-notifications-list");
		let total_count = Math.min(this.notifications.length, total_to_view);

		for(let i = 0, l = total_count; i < l; ++ i){
			let $entry = this.create_row(this.notifications[i]);

			$tbody.append($entry);
		}

		if(total_count == this.notifications.length){
			$("#pd-profile-notifications-load-more").remove();
		}
	}

	static clear_entries(){
		$("#pd-profile-notifications-list").empty();
	}

	static create_row(entry){
		let $row = $("<tr></tr>");
		let $main = $("<td class='main'></td>");
		let $time = $("<td class='time-container'></td>");
		let id = parseInt(entry.split("@@")[1], 10);

		if(!this.has_viewed(id, true)){
			$main.append($("<span class='new-icon'>new</span>)"));
		}

		$main.append(document.createTextNode(entry.split("@@")[0]));

		$time.html("<abbr class='o-timestamp time' data-timestamp='" + id + "' title='" + new Date(id) + "'></abbr>");

		$row.append($main);
		$row.append($time);

		return $row;
	}

	static create_load_more(){
		if(this.total_showing < this.notifications.length){
			return $("<a href='#' class='show-more' id='pd-profile-notifications-load-more'>Show More</a>").on("click", (evt) => {

				this.total_showing += 5;
				this.clear_entries();
				this.create_entries(this.total_showing);
				this.set_tab_count();

				evt.preventDefault();

			});
		}

		return null;
	}

	static has_viewed(notification_id, mark = false){
		let local_data = localStorage.getItem("pd_profile_notifications");
		let ret = false;

		if(local_data && profile_notifications.is_json(local_data)){
			let local = JSON.parse(local_data);

			if(Array.isArray(local) && $.inArrayLoose(notification_id, local) > -1){
				ret = true;
			}
		}

		if(!ret && mark){
			//this.mark_as_viewed(notification_id);
		}

		return ret;
	}

	static mark_as_viewed(notification_id){
		let local_data = localStorage.getItem("pd_profile_notifications");
		let local = [];

		if(local_data && profile_notifications.is_json(local_data)){
			local = JSON.parse(local_data);
		}

		local.push(notification_id);

		localStorage.setItem("pd_profile_notifications", JSON.stringify(local));
	}

	static set_tab_count(){
		if(this.notifications && this.notifications.length > 0){
			let $notify_anchor = $(".ui-tabMenu li").find("a[href*=notifications]");

			if($notify_anchor.length > 0){
				let total = this.get_total_unviewed_notifications();

				if(total > 0){
					if($notify_anchor.html().match(/(\((.+?)\))/)){
						let current_total = parseInt(RegExp.$2.replace(/\D/g, ""), 10);

						$notify_anchor.html($notify_anchor.html().replace(RegExp.$1, "(" + profile_notifications.number_format(total + current_total) + ")"));
					} else {
						$notify_anchor.append(document.createTextNode(" (" + profile_notifications.number_format(total) + ")"))
					}
				}
			}
		}
	}

	static get_total_unviewed_notifications(){
		let count = 0;

		for(let i = 0, l = this.notifications.length; i < l; ++ i){
			if(!this.has_viewed(parseInt(this.notifications[i].split("@@")[1], 10), false)){
				count ++;
			}
		}

		return count;
	}

	static mark_all_viewed(){
		for(let i = 0, l = this.notifications.length; i < l; ++ i){
			this.mark_as_viewed(parseInt(this.notifications[i].split("@@")[1], 10));
		}
	}

};

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

profile_notifications.api.key = class {

	static init(){
		this.pb_key_obj = pb.plugin.key;

		return this.wrapper.bind(this);
	}

	/**
	 * @ignore
	 */

	static wrapper(key = ""){
		return Object.assign(Object.create(null), {

			exists: () => this.exists(key),
			obj: () => this.key_obj(key),
			is_empty: object_id => this.is_empty(key, object_id),
			has_value: object_id => !this.is_empty(key, object_id),
			get: (object_id, is_json) => this.get(key, object_id),
			clear: object_id => this.clear(key, object_id),
			set: (value, object_id, type) => this.set(key, value, object_id, type),
			on: (evt, value, object_id) => this.on(key, evt, value, object_id),
			new_thread: (value, object_id) => this.new_thread(key, value, object_id),
			new_post: (value, object_id) => this.new_post(key, value, object_id),
			new_quick_reply: (value, object_id) => this.post_quick_reply(key, value, object_id),
			append: (value, object_id) => this.append(key, value, object_id),
			prepend: (value, object_id) => this.prepend(key, value, object_id),
			increment: (value, object_id) => this.increment(key, value, object_id),
			decrement: (value, object_id) => this.decrement(key, value, object_id),
			pop: (items, object_id) => this.pop(key, items, object_id),
			push: (value, object_id) => this.push(key, value, object_id),
			push_unique: (value, object_id, strict) => this.push_unique(key, value, object_id, strict),
			shift: (items, object_id) => this.shift(key, items, object_id),
			unshift: (value, object_id) => this.unshift(key, value, object_id),
			unshift_unique: (value, object_id, strict) => this.unshift_unique(key, value, object_id, strict),
			write: object_id => this.write(key, object_id),
			read: object_id => this.read(key, object_id),
			type: (object_id, return_str) => this.type(key, return_str),
			len: object_id => this.len(key, object_id),
			user_key: () => this.user_key(key),
			super_user_key: () => this.super_user_key(key),
			thread_key: () => this.thread_key(key),
			post_key: () => this.post_key(key),
			conversation_key: () => this.conversation_key(key),
			message_key: () => this.message_key(key),
			super_forum_key: () => this.super_forum_key(key),
			has_space: object_id => this.has_space(key, object_id),
			space_left: object_id => this.space_left(key, object_id),
			max_space: () => this.max_space(key)

		});
	}

	/**
	 * Checks to see if a key exists.
	 *
	 * @param {String} key="" - The key to check.
	 *
	 * @return {Boolean}
	 */

	static exists(key = ""){
		if(key){
			if(typeof proboards.plugin._keys[key] != "undefined"){
				return true;
			}
		}

		return false;
	}

	/**
	 * Returns the ProBoards key object.
	 *
	 * @param {String} key="" - The key to get.
	 *
	 * @return {Object}
	 */

	static key_obj(key = ""){
		if(this.exists(key)){
			return this.pb_key_obj(key);
		}

		return {};
	}

	/**
	 * Checks to see if a key is empty
	 *
	 * @param {String} key="" - The key to check.
	 * @param {Number} [object_id=0] - This is the object id, proboards defaults to current user if not set.
	 *
	 * @return {Boolean}
	 */

	static is_empty(key = "", object_id = 0){
		if(this.exists(key)){
			if(typeof this.pb_key_obj(key).get != "undefined"){
				let val = this.pb_key_obj(key).get(object_id || undefined) || "";

				if(val.toString().length > 0 || JSON.stringify(val).length > 2){
					return false;
				}
			}
		}

		return true;
	}

	/**
	 * Gets the value stored in the key.
	 *
	 * @param {String} key="" - The ProBoards key we are getting.
	 * @param {Number} [object_id=0] - This is the object id, proboards defaults to current user if not set.
	 * @param {Boolean} [is_json=false] - If true, it will parse the JSON string.  ProBoards handles parsing now it seems.
	 *
	 * @returns {String|Object} - If no value, an empty string is returned.
	 */

	static get(key = "", object_id, is_json = false){
		if(this.exists(key)){
			object_id = object_id || undefined;

			if(!this.is_empty(key, object_id)){
				let value = this.pb_key_obj(key).get(object_id);

				if(is_json && profile_notifications.is_json(value)){
					value = JSON.parse(value);
				}

				return value;
			}
		}

		return "";
	}

	/**
	 * Clears out key value.
	 *
	 * @param {String} key="" - The key.
	 * @param {Number} [object_id=0] - This is the object id, proboards defaults to current user if not set.
	 *
	 * @return {Object} Returns a promise.
	 */

	static clear(key = "", object_id){
		return this.set(key, "", object_id);
	}

	/**
	 * Sets a key value.
	 *
	 * @example
	 * // Basic example (will set for current user):
	 *
	 * yootil.key("mykey").set("apples");
	 *
	 * @example
	 * //Using resolve and reject for promise.
	 *
	 * yootil.key("mykey").set("somevalue", yootil.user.id()).then((status) => {
	 *     console.log(status.message);
	 * }).catch((status) => {
	 *     console.log(status.message);
	 * });
	 *
	 * @param {String} key="" - The key.
	 * @param {String|Object} value="" - Can be a string, or a object.  ProBoards now handles stringifying objects.
	 * @param {Number} [object_id] - This is the object id, proboards defaults to current user if not set.
	 * @param {String} [type=""] - Passed on set the method type (i.e append, pop etc).
	 *
	 * @return {Object} - Returns a promise.
	 */

	static set(key = "", value = "", object_id, type = ""){
		let p = new Promise((resolve, reject) => {
			object_id = object_id || undefined;

			if(this.exists(key)){
				let options = {

					object_id,
					value

				};

				options.error = function(status){
					reject(status);
				}

				options.success = function(status){
					resolve(status);
				}

				if(type){
					switch(type){

						case "push" :
						case "unshift" :

							if(Array.isArray(options.value) && options.value.length > 1){
								options.values = options.value;
								delete options.value;
							}

							break;

						case "pop" :
						case "shift" :

							if(options.value){
								options.num_items = (~~ options.value);
								delete options.value;
							}

							break;
					}

					this.pb_key_obj(key)[type](options);
				} else {
					this.pb_key_obj(key).set(options);
				}
			} else {
				reject({
					message: "Key does not exist"
				});
			}

		});

		return p;
	}

	/**
	 * Key is set when an event occurs.
	 *
	 * @param {String} key="" - The key.
	 * @param {String} [event=""] - The event to use.
	 * @param {Mixed} value - The value to be stored in the key.  ProBoards handles stringify now.
	 * @param {Number} [object_id=undefined] - This is the object id, proboards defaults to current user if not set.
	 *
	 * @return {Boolean} - Returns true if successful (relies on what ProBoards .set returns).
	 */

	static on(key, event = "", value, object_id = undefined){
		if(!event){
			return false;
		}

		return this.pb_key_obj(key).set_on(event, object_id, value);
	}

	/**
	 * Concatenates a given value to the end of the existing key value.
	 *
	 * @param {String} key - The key.
	 * @param {Mixed} value - Can be a string or a number.
	 * @param {Number} [object_id] - This is the object id, proboards defaults to current user if not set.
	 *
	 * @return {Object} - Returns a promise.
	 */

	static append(key, value, object_id){
		return this.set(key, value, object_id, "append");
	}

	/**
	 * Inserts a given value in front of the existing key value.
	 *
	 * @param {String} key - The key.
	 * @param {Mixed} value - Can be a string or a number.
	 * @param {Number} [object_id] - This is the object id, proboards defaults to current user if not set.
	 *
	 * @return {Object} - Returns a promise.
	 */

	static prepend(key, value, object_id){
		return this.set(key, value, object_id, "prepend");
	}

	/**
	 * If the key is an integer, increases the key's value by one, or you can supply a different amount to increment by.
	 *
	 * @param {String} key - The key.
	 * @param {Number} [value=1] - Increment by this amount.  Default is 1.
	 * @param {Number} [object_id] - This is the object id, proboards defaults to current user if not set.
	 *
	 * @return {Object} - Returns a promise.
	 */

	static increment(key, value = 1, object_id){
		return this.set(key, value, object_id, "increment");
	}

	/**
	 * If the key is an integer, decreases the key's value by one, or you can supply a different amount to decrement by.
	 *
	 * @param {String} key - The key.
	 * @param {Number} [value=1] - Decrement by this amount.  Default is 1.
	 * @param {Number} [object_id] - This is the object id, proboards defaults to current user if not set.
	 *
	 * @return {Object} - Returns a promise.
	 */

	static decrement(key, value = 1, object_id){
		return this.set(key, value, object_id, "decrement");
	}

	/**
	 * If the key is an array, removes the last number of items specified.
	 *
	 * @param {String} key - The key.
	 * @param {Number} [num_items=1] - Number of items to pop from the key.
	 * @param {Number} [object_id] - This is the object id, proboards defaults to current user if not set.
	 *
	 * @return {Object} - Returns a promise.
	 */

	static pop(key, num_items = 1, object_id){
		return this.set(key, num_items, object_id, "pop");
	}

	/**
	 * If the key is an array, adds the given value to the end of the array.
	 *
	 * @example
	 * yootil.key("mykey").push("apples");
	 *
	 * @example
	 * yootil.key("mykey").push(["apples", "pears"], yootil.user.id());
	 *
	 * @param {String} key - The key.
	 * @param {String|Array} value - The value to be pushed into the key.  This can be an array of values.
	 * @param {Number} [object_id] - This is the object id, proboards defaults to current user if not set.
	 *
	 * @return {Object} - Returns a promise.
	 */

	static push(key, value, object_id){
		value = (Array.isArray(value) && value.length == 1)? value[0] : value;

		return this.set(key, value, object_id, "push");
	}

	/**
	 * If the key is an array, adds the given value to the end of the array only if they are unique.
	 *
	 * @example
	 * yootil.key("mykey").push_unique("apples");
	 *
	 * @example
	 * yootil.key("mykey").push_unique(["apples", "pears"], false, yootil.user.id()); // Don't use strict
	 *
	 * @param {String} key - The key.
	 * @param {Mixed} value - The value to be pushed into the key.  This can be an array of values.
	 * @param {Number} [object_id] - This is the object id, proboards defaults to current user if not set.
	 * @param {Boolean} [strict=false] - If set to true, it will use inArray instead of ProBoards inArrayLoose.
	 *
	 * @return {Object} - Returns a promise.
	 */

	static push_unique(key, value, object_id, strict = false){
		let current_value = this.value(key);

		if(!current_value || !Array.isArray(current_value)){
			current_value = [];
		}

		let new_values = [];

		if(typeof value != "undefined"){
			if(Array.isArray(value)){
				new_values = value;
			} else {
				new_values.push(value);
			}
		}

		if(new_values.length){
			let to_push = [];

			for(let item of new_values){
				let af = (strict)? ((val) => val === item) : ((val) => val == item);

				if(!current_value.find(af)){
					to_push.push(item);
				}
			}

			if(to_push.length){
				to_push = (to_push.length == 1)? to_push[0] : to_push;

				return this.push(key, to_push, object_id);
			}
		}
	}

	/**
	 * If the key is an array, removes the first "num_items" values.
	 *
	 * @param {String} key - The key.
	 * @param {Number} [num_items=1] - The number of items to shift from the array.
	 * @param {Number} [object_id] - This is the object id, proboards defaults to current user if not set.
	 *
	 * @return {Object} - Returns a promise.
	 */

	static shift(key, num_items = 1, object_id){
		return this.set(key, num_items, object_id, "shift");
	}

	/**
	 * If the key is an array, adds value to the front of the array.
	 *
	 * @param {String} key - The key.
	 * @param {String|Array} value - The value to be pushed into the key.  This can be an array of values.
	 * @param {Number} [object_id] - This is the object id, proboards defaults to current user if not set.
	 *
	 * @return {Object} - Returns a promise.
	 */

	static unshift(key, value, object_id){
		value = (Array.isArray(value) && value.length == 1)? value[0] : value;

		return this.set(key, value, object_id, "unshift");
	}

	/**
	 * If the key is an array, adds the given value to the front of the array only if they are unique.
	 *
	 * @example
	 * yootil.key("mykey").unshift_unique("apples");
	 *
	 * @example
	 * yootil.key("mykey").unshift_unique(["apples", "pears"], false, yootil.user.id()); // Don't use strict
	 *
	 * @param {String} key - The key.
	 * @param {Mixed} value - The value to be pushed into the key.  This can be an array of values.
	 * @param {Number} [object_id] - This is the object id, proboards defaults to current user if not set.
	 * @param {Boolean} [strict=false] - If set to true, it will use inArray instead of ProBoards inArrayLoose.
	 *
	 * @return {Object} - Returns a promise.
	 */

	static unshift_unique(key, value, object_id, strict = false){
		let current_value = this.value(key);

		if(!current_value || !Array.isArray(current_value)){
			current_value = [];
		}

		let new_values = [];

		if(typeof value != "undefined"){
			if(Array.isArray(value)){
				new_values = value;
			} else {
				new_values.push(value);
			}
		}

		if(new_values.length){
			let to_push = [];

			for(let item of new_values){
				let af = (strict)? ((val) => val === item) : ((val) => val == item);

				if(!current_value.find(af)){
					to_push.push(item);
				}
			}

			if(to_push.length){
				to_push = (to_push.length == 1)? to_push[0] : to_push;

				return this.unshift(key, to_push, object_id);
			}
		}
	}

	/**
	 * Checks permission on key to see if the user can write.
	 *
	 * @param {String} key - The key.
	 * @param {Number} object_id - This is the object id, proboards defaults to current user if not set.
	 *
	 * @return {Boolean}
	 */

	static write(key, object_id){
		if(this.exists(key)){
			if(typeof this.pb_key_obj(key).can_write != "undefined"){
				return !!this.pb_key_obj(key).can_write(object_id);
			}
		}

		return false;
	}

	/**
	 *  Checks permission on key to see if the user can read.
	 *
	 * @param {String} key - The key.
	 * @param {Number} object_id - This is the object id, proboards defaults to current user if not set.
	 *
	 * @return {Boolean}
	 */

	static read(key, object_id){
		if(this.exists(key)){
			if(typeof this.pb_key_obj(key).can_read != "undefined"){
				return !!this.pb_key_obj(key).can_read(object_id);
			} else {

				// ProBoards hasn't exposed it.
				// Just return true so we don't break plugins

				return true;
			}
		}

		return false;
	}

	/**
	 * Get they key type.
	 *
	 * @param {String} key - The key.
	 * @param {Boolean} [return_str=false] - If true, it will return a string value (i.e "USER").
	 *
	 * @return {String}
	 */

	static type(key, return_str = false){
		let type = this.pb_key_obj(key).type();

		if(return_str){
			let types = pb.plugin.key_types();

			for(let k in types){
				if(types[k] == type){
					type = k;
					break;
				}
			}
		}

		return type;
	}

	/**
	 * Gets the length of a key.
	 *
	 * @param {String} key - The key to be checked.
	 * @param {Number} object_id - Object id.
	 *
	 * @return {Number} - Returns the length.
	 */

	static len(key, object_id){
		let val = this.get(key, object_id);

		if(typeof val == "string"){
			return val.length;
		}

		return (typeof val === "undefined")? 0 : JSON.stringify(val).length;
	}

	/**
	 * Checks to see if the key is a user type.
	 *
	 * @param {String} key - The key to check.
	 *
	 * @return {Boolean}
	 */

	static user_key(key){
		if(this.type(key) == 1){
			return true;
		}

		return false;
	}

	/**
	 * Checks to see if the key is a super user type.
	 *
	 * @param {String} key - The key to check.
	 *
	 * @return {Boolean}
	 */

	static super_user_key(key){
		if(this.type(key) == 2){
			return true;
		}

		return false;
	}

	/**
	 * Checks to see if the key is a thread type.
	 *
	 * @param {String} key - The key to check.
	 *
	 * @return {Boolean}
	 */

	static thread_key(key){
		if(this.type(key) == 3){
			return true;
		}

		return false;
	}

	/**
	 * Checks to see if the key is a post type.
	 *
	 * @param {String} key - The key to check.
	 *
	 * @return {Boolean}
	 */

	static post_key(key){
		if(this.type(key) == 4){
			return true;
		}

		return false;
	}

	/**
	 * Checks to see if the key is a conversation type.
	 *
	 * @param {String} key - The key to check.
	 *
	 * @return {Boolean}
	 */

	static conversation_key(key){
		if(this.type(key) == 5){
			return true;
		}

		return false;
	}

	/**
	 * Checks to see if the key is a message type.
	 *
	 * @param {String} key - The key to check.
	 *
	 * @return {Boolean}
	 */

	static message_key(key){
		if(this.type(key) == 6){
			return true;
		}

		return false;
	}

	/**
	 * Checks to see if the key is a super_forum type.
	 *
	 * @param {String} key - The key to check.
	 *
	 * @return {Boolean}
	 */

	static super_forum_key(key){
		if(this.type(key) == 7){
			return true;
		}

		return false;
	}

	/**
	 * Checks to see if the key has space.
	 *
	 * @param {String} key - The key to check.
	 * @param {Number} object_id - Object id.
	 *
	 * @return {Boolean}
	 */

	static has_space(key, object_id){
		let max_length = (this.super_forum_key(key))? pb.data("plugin_max_super_forum_key_length") : pb.data("plugin_max_key_length");

		if(this.length(key, object_id) < max_length){
			return true;
		}

		return false;
	}

	/**
	 * Gets the space left in the key.
	 *
	 * @param {String} key - The key to check.
	 * @param {Number} object_id - Object id.
	 *
	 * @return {Number}
	 */

	static space_left(key, object_id){
		let max_length = (this.super_forum_key(key))? pb.data("plugin_max_super_forum_key_length") : pb.data("plugin_max_key_length");
		let key_length = this.length(key, object_id);
		let space_left = max_length - key_length;

		return (space_left < 0)? 0 : space_left;
	}

	/**
	 * Gets max space (characters).
	 *
	 * @param {String} key - The key to check.
	 *
	 * @return {Number}
	 */

	static max_space(key){
		let max_length = (this.super_forum_key(key))? pb.data("plugin_max_super_forum_key_length") : pb.data("plugin_max_key_length");

		return (max_length - 2);
	}

};

profile_notifications.api.key = profile_notifications.api.key.init();

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

/**
 * Front key pruner.
 *
 * Will prune from the front and add to the end.
 *
 * Use in combination with key pushing.  Attempt to push to the key, if it fails, prune it and save.
 */

profile_notifications.api.pruner = class {

	constructor({key = null, object_id = undefined} = {}){
		this.key = key;
		this.object_id = object_id;
		this._pruned_data = [];
		this.new_data = [];
	}

	/**
	 * Will initiate the pruning while trying to add new data.
	 *
	 * @param {Array} add=[] - The data to add.
	 *
	 * @return {Boolean} - Returns true if the prune was successful.
	 */

	prune(add = []){
		if(!add || !this.key){
			return false;
		}

		if(!Array.isArray(add)){
			add = [add];
		}

		let all_data = [];
		let key_data = this.key.get(this.object_id) || [];

		all_data = all_data.concat(key_data);
		all_data = all_data.concat(add);

		let has_pruned = false;

		if(all_data.length > 0){
			while(JSON.stringify(all_data).length >= 100){
				this._pruned_data.push(key_data.shift());
				all_data.shift();
				has_pruned = true;
			}
		}

		this.new_data = all_data;
		return has_pruned;
	}

	save(){
		return this.key.set(this.new_data, this.object_id);
	}

	/**
	 * Returns any data that was pruned.
	 *
	 * @return {Array)
	 */

	pruned_data(){
		return this._pruned_data;
	}

};

profile_notifications.init();