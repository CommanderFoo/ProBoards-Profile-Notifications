class profile_notifications {

	static init(){
		this.version = "{VER}";

		// Total notifications to show.
		// Ideally this would become a setting in the
		// plugin admin area.

		this.SHOW_AMOUNT = 5;

		this.PLUGIN_KEY = "pd_profile_notifications";
		this.PLUGIN_ID = "pd_profile_notifications";
		this.PLUGIN_VERSION = "{VER}";
		this.PLUGIN_SETTINGS = null;
		this.PLUGIN_IMAGES = null;
		this.PLUGIN = null;

		this.events = Object.create(null);

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