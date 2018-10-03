"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var profile_notifications = function () {
	function profile_notifications() {
		_classCallCheck(this, profile_notifications);
	}

	_createClass(profile_notifications, null, [{
		key: "init",
		value: function init() {
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
	}, {
		key: "ready",
		value: function ready() {
			if (this.ROUTE.name == "show_user_notifications") {
				profile_notifications_display.display_list();
			}

			if (this.ROUTE.name.match(/^show_user_/i) || this.ROUTE.name == "user") {
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
	}, {
		key: "setup",
		value: function setup() {
			var plugin = pb.plugin.get(this.PLUGIN_ID);

			if (plugin && plugin.settings) {
				this.PLUGIN = plugin;
				this.PLUGIN_SETTINGS = plugin.settings;

				if (plugin.images) {
					this.PLUGIN_IMAGES = plugin.images;
				}
			}
		}
	}, {
		key: "setup_data",
		value: function setup_data() {
			var data = proboards.plugin.keys.data[this.PLUGIN_KEY];

			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = Object.entries(data)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var _ref = _step.value;

					var _ref2 = _slicedToArray(_ref, 2);

					var object_key = _ref2[0];
					var value = _ref2[1];

					var id = parseInt(object_key, 10) || 0;

					if (id > 0) {
						var user_data = this.KEY_DATA.get(id);

						if (!user_data) {
							user_data = new profile_notifications.data(id);
							this.KEY_DATA.set(id, user_data);
						}

						user_data.setup(value);
					}
				}
			} catch (err) {
				_didIteratorError = true;
				_iteratorError = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion && _iterator.return) {
						_iterator.return();
					}
				} finally {
					if (_didIteratorError) {
						throw _iteratorError;
					}
				}
			}
		}
	}, {
		key: "html_encode",
		value: function html_encode() {
			var str = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
			var decode_first = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

			str = decode_first ? this.html_decode(str) : str;

			return $("<div />").text(str).html();
		}
	}, {
		key: "html_decode",
		value: function html_decode() {
			var str = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";

			this._textarea.innerHTML = str;

			var val = this._textarea.value;

			this._textarea.innerHTML = "";

			return val;
		}
	}, {
		key: "is_json",
		value: function is_json() {
			var str = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
			var return_obj = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

			try {
				str = JSON.parse(str);
			} catch (e) {
				return false;
			}

			if (return_obj) {
				return str;
			}

			return true;
		}
	}, {
		key: "number_format",
		value: function number_format() {
			var str = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
			var delim = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ",";

			return str.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1" + delim) || "0";
		}
	}]);

	return profile_notifications;
}();

var profile_notifications_display = function () {
	function profile_notifications_display() {
		_classCallCheck(this, profile_notifications_display);
	}

	_createClass(profile_notifications_display, null, [{
		key: "init",
		value: function init() {
			this.total_showing = profile_notifications.SHOW_AMOUNT;

			this.notifications = profile_notifications.api.get(parseInt(pb.data("user").id, 10)).notifications().slice().reverse();
		}
	}, {
		key: "display_tip",
		value: function display_tip() {
			var total_unviewed = this.get_total_unviewed_notifications();

			if (total_unviewed > 0) {
				var $link = $("#navigation-menu a[href^=\\/user\\/]");
				var $tip = $link.find(".tip-holder");

				if ($tip.length == 0) {
					$tip = this.create_tip();
					$link.append($tip);
				}

				var $tip_number = $tip.find(".tip-number");
				var total = total_unviewed;

				if ($tip_number.html().match(/(.+?)/)) {
					total += parseInt(RegExp.$1.replace(/\D/g, ""), 10);
				}

				$tip_number.html(profile_notifications.number_format(total));

				this.mark_all_viewed();
			}
		}
	}, {
		key: "display_list",
		value: function display_list() {
			if (this.notifications && this.notifications.length > 0) {
				var $container = this.create_container();
				var $table = this.create_table();

				$table.append(this.create_tbody());

				$container.append($table);

				var $load_more = this.create_load_more();

				if ($load_more) {
					$container.append($load_more);
				}

				var $existing_box = $(".show-user").find("div.content-box");

				if ($existing_box.length > 0) {
					$container.insertBefore($existing_box);

					this.create_entries(profile_notifications.SHOW_AMOUNT);
				}
			}
		}
	}, {
		key: "create_tip",
		value: function create_tip() {
			return $("<div class='tip-holder'><div class='tip-number'></div><span class='tip'></span></div>").on("click", function (evt) {

				location.href = "/user/" + parseInt(pb.data("user").id, 10) + "/notifications";

				evt.preventDefault();
			});
		}
	}, {
		key: "create_container",
		value: function create_container() {
			return $("<div class='content-box pd-profile-notifications'><br /></div>");
		}
	}, {
		key: "create_table",
		value: function create_table() {
			return $("<table class='notifications list'></table>");
		}
	}, {
		key: "create_tbody",
		value: function create_tbody() {
			return $("<tbody class='notifications-container' id='pd-profile-notifications-list'></tbody>");
		}
	}, {
		key: "create_entries",
		value: function create_entries(total_to_view) {
			var $tbody = $("#pd-profile-notifications-list");
			var total_count = Math.min(this.notifications.length, total_to_view);

			for (var i = 0, l = total_count; i < l; ++i) {
				var $entry = this.create_row(this.notifications[i]);

				$tbody.append($entry);
			}

			if (total_count == this.notifications.length) {
				$("#pd-profile-notifications-load-more").remove();
			}
		}
	}, {
		key: "clear_entries",
		value: function clear_entries() {
			$("#pd-profile-notifications-list").empty();
		}
	}, {
		key: "create_row",
		value: function create_row(entry) {
			var $row = $("<tr></tr>");
			var $main = $("<td class='main'></td>");
			var $time = $("<td class='time-container'></td>");
			var id = parseInt(entry.split("@@")[1], 10);

			if (!this.has_viewed(id, true)) {
				$main.append($("<span class='new-icon'>new</span>)"));
			}

			$main.append(document.createTextNode(entry.split("@@")[0]));

			$time.html("<abbr class='o-timestamp time' data-timestamp='" + id + "' title='" + new Date(id) + "'></abbr>");

			$row.append($main);
			$row.append($time);

			return $row;
		}
	}, {
		key: "create_load_more",
		value: function create_load_more() {
			var _this = this;

			if (this.total_showing < this.notifications.length) {
				return $("<a href='#' class='show-more' id='pd-profile-notifications-load-more'>Show More</a>").on("click", function (evt) {

					_this.total_showing += 5;
					_this.clear_entries();
					_this.create_entries(_this.total_showing);
					_this.set_tab_count();

					evt.preventDefault();
				});
			}

			return null;
		}
	}, {
		key: "has_viewed",
		value: function has_viewed(notification_id) {
			var mark = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

			var local_data = localStorage.getItem("pd_profile_notifications");
			var ret = false;

			if (local_data && profile_notifications.is_json(local_data)) {
				var local = JSON.parse(local_data);

				if (Array.isArray(local) && $.inArrayLoose(notification_id, local) > -1) {
					ret = true;
				}
			}

			if (!ret && mark) {
				//this.mark_as_viewed(notification_id);
			}

			return ret;
		}
	}, {
		key: "mark_as_viewed",
		value: function mark_as_viewed(notification_id) {
			var local_data = localStorage.getItem("pd_profile_notifications");
			var local = [];

			if (local_data && profile_notifications.is_json(local_data)) {
				local = JSON.parse(local_data);
			}

			local.push(notification_id);

			localStorage.setItem("pd_profile_notifications", JSON.stringify(local));
		}
	}, {
		key: "set_tab_count",
		value: function set_tab_count() {
			if (this.notifications && this.notifications.length > 0) {
				var $notify_anchor = $(".ui-tabMenu li").find("a[href*=notifications]");

				if ($notify_anchor.length > 0) {
					var total = this.get_total_unviewed_notifications();

					if (total > 0) {
						if ($notify_anchor.html().match(/(\((.+?)\))/)) {
							var current_total = parseInt(RegExp.$2.replace(/\D/g, ""), 10);

							$notify_anchor.html($notify_anchor.html().replace(RegExp.$1, "(" + profile_notifications.number_format(total + current_total) + ")"));
						} else {
							$notify_anchor.append(document.createTextNode(" (" + profile_notifications.number_format(total) + ")"));
						}
					}
				}
			}
		}
	}, {
		key: "get_total_unviewed_notifications",
		value: function get_total_unviewed_notifications() {
			var count = 0;

			for (var i = 0, l = this.notifications.length; i < l; ++i) {
				if (!this.has_viewed(parseInt(this.notifications[i].split("@@")[1], 10), false)) {
					count++;
				}
			}

			return count;
		}
	}, {
		key: "mark_all_viewed",
		value: function mark_all_viewed() {
			for (var i = 0, l = this.notifications.length; i < l; ++i) {
				this.mark_as_viewed(parseInt(this.notifications[i].split("@@")[1], 10));
			}
		}
	}]);

	return profile_notifications_display;
}();

;

profile_notifications.api = function () {
	function _class() {
		_classCallCheck(this, _class);
	}

	_createClass(_class, null, [{
		key: "init",
		value: function init() {}
	}, {
		key: "data",
		value: function data() {
			var user_id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

			var id = parseInt(user_id, 10) || 0;

			if (id > 0) {
				if (!profile_notifications.KEY_DATA.get(id)) {
					profile_notifications.KEY_DATA.set(id, new profile_notifications.data(id));
				}

				return profile_notifications.KEY_DATA.get(id);
			}

			console.warn("Profile Notifications API: User ID not valid");

			return null;
		}
	}, {
		key: "create",
		value: function create() {
			var user_id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

			var user_data = this.data(user_id);

			if (!user_data) {
				return null;
			}

			return {
				notification: function notification() {
					var message = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";

					var data = message + "@@" + +new Date();
					var p = null;
					var key_obj = profile_notifications.api.key(profile_notifications.PLUGIN_KEY);

					var pruner = new profile_notifications.api.pruner({

						key: key_obj,
						object_id: user_id

					});

					pruner.prune([data]);

					if (pruner.pruned_data().length > 0) {
						p = pruner.save();

						var pruned_data = pruner.pruned_data();
						var local_data = localStorage.getItem("pd_profile_notifications");

						if (local_data && profile_notifications.is_json(local_data)) {
							var local = JSON.parse(local_data);

							if (Array.isArray(local)) {
								var has_changes = false;

								for (var _p = 0, pl = pruned_data.length; _p < pl; ++_p) {
									var notification_id = parseInt(pruned_data[_p].split("@@")[1], 10);

									if ($.inArrayLoose(notification_id, local) > -1) {
										local.splice(_p, 1);
										has_changes = true;
									}
								}

								if (has_changes) {
									localStorage.setItem("pd_profile_notifications", JSON.stringify(local));
								}
							}
						}
					} else {
						var _key_obj = profile_notifications.api.key(profile_notifications.PLUGIN_KEY);

						if (_key_obj.is_empty(user_id)) {
							p = _key_obj.set([data], user_id);
						} else {
							p = _key_obj.set(data, user_id, "push");
						}
					}

					p.then(function () {
						return profile_notifications.api.refresh_all_data();
					});

					return p;
				}
			};
		}
	}, {
		key: "get",
		value: function get() {
			var user_id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

			var user_data = this.data(user_id);

			if (!user_data) {
				return null;
			}

			return {
				notifications: function notifications() {
					return user_data.get() || [];
				}
			};
		}
	}, {
		key: "set",
		value: function set() {
			var user_id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

			var user_data = this.data(user_id);

			if (!user_data) {
				return null;
			}

			return {
				data: function data() {
					var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

					user_data.set(data);
				}
			};
		}
	}, {
		key: "clear",
		value: function clear() {
			var user_id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

			var user_data = this.data(user_id);

			if (!user_data) {
				return null;
			}

			return {
				notifications: function notifications() {
					localStorage.removeItem("pd_profile_notifications");

					return user_data.clear();
				}
			};
		}
	}, {
		key: "save",
		value: function save() {
			var _this2 = this;

			var user_id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

			return new Promise(function (resolve, reject) {
				var user_data = _this2.data(user_id);

				if (user_data) {
					user_data.save().then(function (status) {
						return resolve(status);
					}).catch(function (status) {
						return reject(status);
					});
				} else {
					var evt_obj = Object.create(null);

					evt_obj.user_id = user_id;
					evt_obj.message = "No user data";

					reject(evt_obj);
				}
			});
		}
	}, {
		key: "refresh_all_data",
		value: function refresh_all_data() {
			profile_notifications.setup_data();
		}
	}]);

	return _class;
}();

profile_notifications.api.key = function () {
	function _class2() {
		_classCallCheck(this, _class2);
	}

	_createClass(_class2, null, [{
		key: "init",
		value: function init() {
			this.pb_key_obj = pb.plugin.key;

			return this.wrapper.bind(this);
		}

		/**
   * @ignore
   */

	}, {
		key: "wrapper",
		value: function wrapper() {
			var _this3 = this;

			var key = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";

			return Object.assign(Object.create(null), {

				exists: function exists() {
					return _this3.exists(key);
				},
				obj: function obj() {
					return _this3.key_obj(key);
				},
				is_empty: function is_empty(object_id) {
					return _this3.is_empty(key, object_id);
				},
				has_value: function has_value(object_id) {
					return !_this3.is_empty(key, object_id);
				},
				get: function get(object_id, is_json) {
					return _this3.get(key, object_id);
				},
				clear: function clear(object_id) {
					return _this3.clear(key, object_id);
				},
				set: function set(value, object_id, type) {
					return _this3.set(key, value, object_id, type);
				},
				on: function on(evt, value, object_id) {
					return _this3.on(key, evt, value, object_id);
				},
				new_thread: function new_thread(value, object_id) {
					return _this3.new_thread(key, value, object_id);
				},
				new_post: function new_post(value, object_id) {
					return _this3.new_post(key, value, object_id);
				},
				new_quick_reply: function new_quick_reply(value, object_id) {
					return _this3.post_quick_reply(key, value, object_id);
				},
				append: function append(value, object_id) {
					return _this3.append(key, value, object_id);
				},
				prepend: function prepend(value, object_id) {
					return _this3.prepend(key, value, object_id);
				},
				increment: function increment(value, object_id) {
					return _this3.increment(key, value, object_id);
				},
				decrement: function decrement(value, object_id) {
					return _this3.decrement(key, value, object_id);
				},
				pop: function pop(items, object_id) {
					return _this3.pop(key, items, object_id);
				},
				push: function push(value, object_id) {
					return _this3.push(key, value, object_id);
				},
				push_unique: function push_unique(value, object_id, strict) {
					return _this3.push_unique(key, value, object_id, strict);
				},
				shift: function shift(items, object_id) {
					return _this3.shift(key, items, object_id);
				},
				unshift: function unshift(value, object_id) {
					return _this3.unshift(key, value, object_id);
				},
				unshift_unique: function unshift_unique(value, object_id, strict) {
					return _this3.unshift_unique(key, value, object_id, strict);
				},
				write: function write(object_id) {
					return _this3.write(key, object_id);
				},
				read: function read(object_id) {
					return _this3.read(key, object_id);
				},
				type: function type(object_id, return_str) {
					return _this3.type(key, return_str);
				},
				len: function len(object_id) {
					return _this3.len(key, object_id);
				},
				user_key: function user_key() {
					return _this3.user_key(key);
				},
				super_user_key: function super_user_key() {
					return _this3.super_user_key(key);
				},
				thread_key: function thread_key() {
					return _this3.thread_key(key);
				},
				post_key: function post_key() {
					return _this3.post_key(key);
				},
				conversation_key: function conversation_key() {
					return _this3.conversation_key(key);
				},
				message_key: function message_key() {
					return _this3.message_key(key);
				},
				super_forum_key: function super_forum_key() {
					return _this3.super_forum_key(key);
				},
				has_space: function has_space(object_id) {
					return _this3.has_space(key, object_id);
				},
				space_left: function space_left(object_id) {
					return _this3.space_left(key, object_id);
				},
				max_space: function max_space() {
					return _this3.max_space(key);
				}

			});
		}

		/**
   * Checks to see if a key exists.
   *
   * @param {String} key="" - The key to check.
   *
   * @return {Boolean}
   */

	}, {
		key: "exists",
		value: function exists() {
			var key = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";

			if (key) {
				if (typeof proboards.plugin._keys[key] != "undefined") {
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

	}, {
		key: "key_obj",
		value: function key_obj() {
			var key = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";

			if (this.exists(key)) {
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

	}, {
		key: "is_empty",
		value: function is_empty() {
			var key = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
			var object_id = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

			if (this.exists(key)) {
				if (typeof this.pb_key_obj(key).get != "undefined") {
					var val = this.pb_key_obj(key).get(object_id || undefined) || "";

					if (val.toString().length > 0 || JSON.stringify(val).length > 2) {
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

	}, {
		key: "get",
		value: function get() {
			var key = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
			var object_id = arguments[1];
			var is_json = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

			if (this.exists(key)) {
				object_id = object_id || undefined;

				if (!this.is_empty(key, object_id)) {
					var value = this.pb_key_obj(key).get(object_id);

					if (is_json && profile_notifications.is_json(value)) {
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

	}, {
		key: "clear",
		value: function clear() {
			var key = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
			var object_id = arguments[1];

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

	}, {
		key: "set",
		value: function set() {
			var key = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
			var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";

			var _this4 = this;

			var object_id = arguments[2];
			var type = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "";

			var p = new Promise(function (resolve, reject) {
				object_id = object_id || undefined;

				if (_this4.exists(key)) {
					var options = {

						object_id: object_id,
						value: value

					};

					options.error = function (status) {
						reject(status);
					};

					options.success = function (status) {
						resolve(status);
					};

					if (type) {
						switch (type) {

							case "push":
							case "unshift":

								if (Array.isArray(options.value) && options.value.length > 1) {
									options.values = options.value;
									delete options.value;
								}

								break;

							case "pop":
							case "shift":

								if (options.value) {
									options.num_items = ~~options.value;
									delete options.value;
								}

								break;
						}

						_this4.pb_key_obj(key)[type](options);
					} else {
						_this4.pb_key_obj(key).set(options);
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

	}, {
		key: "on",
		value: function on(key) {
			var event = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";
			var value = arguments[2];
			var object_id = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : undefined;

			if (!event) {
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

	}, {
		key: "append",
		value: function append(key, value, object_id) {
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

	}, {
		key: "prepend",
		value: function prepend(key, value, object_id) {
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

	}, {
		key: "increment",
		value: function increment(key) {
			var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
			var object_id = arguments[2];

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

	}, {
		key: "decrement",
		value: function decrement(key) {
			var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
			var object_id = arguments[2];

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

	}, {
		key: "pop",
		value: function pop(key) {
			var num_items = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
			var object_id = arguments[2];

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

	}, {
		key: "push",
		value: function push(key, value, object_id) {
			value = Array.isArray(value) && value.length == 1 ? value[0] : value;

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

	}, {
		key: "push_unique",
		value: function push_unique(key, value, object_id) {
			var strict = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

			var current_value = this.value(key);

			if (!current_value || !Array.isArray(current_value)) {
				current_value = [];
			}

			var new_values = [];

			if (typeof value != "undefined") {
				if (Array.isArray(value)) {
					new_values = value;
				} else {
					new_values.push(value);
				}
			}

			if (new_values.length) {
				var to_push = [];

				var _loop = function _loop(item) {
					var af = strict ? function (val) {
						return val === item;
					} : function (val) {
						return val == item;
					};

					if (!current_value.find(af)) {
						to_push.push(item);
					}
				};

				var _iteratorNormalCompletion2 = true;
				var _didIteratorError2 = false;
				var _iteratorError2 = undefined;

				try {
					for (var _iterator2 = new_values[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
						var item = _step2.value;

						_loop(item);
					}
				} catch (err) {
					_didIteratorError2 = true;
					_iteratorError2 = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion2 && _iterator2.return) {
							_iterator2.return();
						}
					} finally {
						if (_didIteratorError2) {
							throw _iteratorError2;
						}
					}
				}

				if (to_push.length) {
					to_push = to_push.length == 1 ? to_push[0] : to_push;

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

	}, {
		key: "shift",
		value: function shift(key) {
			var num_items = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
			var object_id = arguments[2];

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

	}, {
		key: "unshift",
		value: function unshift(key, value, object_id) {
			value = Array.isArray(value) && value.length == 1 ? value[0] : value;

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

	}, {
		key: "unshift_unique",
		value: function unshift_unique(key, value, object_id) {
			var strict = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

			var current_value = this.value(key);

			if (!current_value || !Array.isArray(current_value)) {
				current_value = [];
			}

			var new_values = [];

			if (typeof value != "undefined") {
				if (Array.isArray(value)) {
					new_values = value;
				} else {
					new_values.push(value);
				}
			}

			if (new_values.length) {
				var to_push = [];

				var _loop2 = function _loop2(item) {
					var af = strict ? function (val) {
						return val === item;
					} : function (val) {
						return val == item;
					};

					if (!current_value.find(af)) {
						to_push.push(item);
					}
				};

				var _iteratorNormalCompletion3 = true;
				var _didIteratorError3 = false;
				var _iteratorError3 = undefined;

				try {
					for (var _iterator3 = new_values[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
						var item = _step3.value;

						_loop2(item);
					}
				} catch (err) {
					_didIteratorError3 = true;
					_iteratorError3 = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion3 && _iterator3.return) {
							_iterator3.return();
						}
					} finally {
						if (_didIteratorError3) {
							throw _iteratorError3;
						}
					}
				}

				if (to_push.length) {
					to_push = to_push.length == 1 ? to_push[0] : to_push;

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

	}, {
		key: "write",
		value: function write(key, object_id) {
			if (this.exists(key)) {
				if (typeof this.pb_key_obj(key).can_write != "undefined") {
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

	}, {
		key: "read",
		value: function read(key, object_id) {
			if (this.exists(key)) {
				if (typeof this.pb_key_obj(key).can_read != "undefined") {
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

	}, {
		key: "type",
		value: function type(key) {
			var return_str = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

			var type = this.pb_key_obj(key).type();

			if (return_str) {
				var types = pb.plugin.key_types();

				for (var k in types) {
					if (types[k] == type) {
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

	}, {
		key: "len",
		value: function len(key, object_id) {
			var val = this.get(key, object_id);

			if (typeof val == "string") {
				return val.length;
			}

			return typeof val === "undefined" ? 0 : JSON.stringify(val).length;
		}

		/**
   * Checks to see if the key is a user type.
   *
   * @param {String} key - The key to check.
   *
   * @return {Boolean}
   */

	}, {
		key: "user_key",
		value: function user_key(key) {
			if (this.type(key) == 1) {
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

	}, {
		key: "super_user_key",
		value: function super_user_key(key) {
			if (this.type(key) == 2) {
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

	}, {
		key: "thread_key",
		value: function thread_key(key) {
			if (this.type(key) == 3) {
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

	}, {
		key: "post_key",
		value: function post_key(key) {
			if (this.type(key) == 4) {
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

	}, {
		key: "conversation_key",
		value: function conversation_key(key) {
			if (this.type(key) == 5) {
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

	}, {
		key: "message_key",
		value: function message_key(key) {
			if (this.type(key) == 6) {
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

	}, {
		key: "super_forum_key",
		value: function super_forum_key(key) {
			if (this.type(key) == 7) {
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

	}, {
		key: "has_space",
		value: function has_space(key, object_id) {
			var max_length = this.super_forum_key(key) ? pb.data("plugin_max_super_forum_key_length") : pb.data("plugin_max_key_length");

			if (this.length(key, object_id) < max_length) {
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

	}, {
		key: "space_left",
		value: function space_left(key, object_id) {
			var max_length = this.super_forum_key(key) ? pb.data("plugin_max_super_forum_key_length") : pb.data("plugin_max_key_length");
			var key_length = this.length(key, object_id);
			var space_left = max_length - key_length;

			return space_left < 0 ? 0 : space_left;
		}

		/**
   * Gets max space (characters).
   *
   * @param {String} key - The key to check.
   *
   * @return {Number}
   */

	}, {
		key: "max_space",
		value: function max_space(key) {
			var max_length = this.super_forum_key(key) ? pb.data("plugin_max_super_forum_key_length") : pb.data("plugin_max_key_length");

			return max_length - 2;
		}
	}]);

	return _class2;
}();

profile_notifications.api.key = profile_notifications.api.key.init();

profile_notifications.data = function () {
	function _class3() {
		var user_id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

		_classCallCheck(this, _class3);

		this.user_id = user_id;
		this._DATA = [];
	}

	_createClass(_class3, [{
		key: "setup",
		value: function setup() {
			var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

			this._DATA = data;
		}
	}, {
		key: "get",
		value: function get() {
			return this._DATA || [];
		}
	}, {
		key: "set",
		value: function set() {
			var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

			this._DATA = data;
		}
	}, {
		key: "clear",
		value: function clear() {
			this._DATA = [];
		}
	}, {
		key: "save",
		value: function save() {
			var key = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
			var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

			var promise = profile_notifications.api.key(profile_notifications.PLUGIN_KEY).set(this._DATA || [], this.user_id, type);

			if (promise) {
				return promise;
			} else {
				return new Promise(function (resolve, reject) {
					reject({
						message: "Key does not exist"
					});
				});
			}
		}
	}]);

	return _class3;
}();

/**
 * Front key pruner.
 *
 * Will prune from the front and add to the end.
 *
 * Use in combination with key pushing.  Attempt to push to the key, if it fails, prune it and save.
 */

profile_notifications.api.pruner = function () {
	function _class4() {
		var _ref3 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
		    _ref3$key = _ref3.key,
		    key = _ref3$key === undefined ? null : _ref3$key,
		    _ref3$object_id = _ref3.object_id,
		    object_id = _ref3$object_id === undefined ? undefined : _ref3$object_id;

		_classCallCheck(this, _class4);

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

	_createClass(_class4, [{
		key: "prune",
		value: function prune() {
			var add = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

			if (!add || !this.key) {
				return false;
			}

			if (!Array.isArray(add)) {
				add = [add];
			}

			var all_data = [];
			var key_data = this.key.get(this.object_id) || [];

			all_data = all_data.concat(key_data);
			all_data = all_data.concat(add);

			var has_pruned = false;

			if (all_data.length > 0) {
				while (JSON.stringify(all_data).length >= 100) {
					this._pruned_data.push(key_data.shift());
					all_data.shift();
					has_pruned = true;
				}
			}

			this.new_data = all_data;
			return has_pruned;
		}
	}, {
		key: "save",
		value: function save() {
			return this.key.set(this.new_data, this.object_id);
		}

		/**
   * Returns any data that was pruned.
   *
   * @return {Array)
   */

	}, {
		key: "pruned_data",
		value: function pruned_data() {
			return this._pruned_data;
		}
	}]);

	return _class4;
}();


profile_notifications.init();