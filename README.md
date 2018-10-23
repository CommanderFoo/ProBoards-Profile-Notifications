Profile Notifications API 1.0.3
===============================

A plugin that creates an API which mimics the [ProBoards](https://www.proboards.com/) notifications system.

The plugin uses 1 super user key.  It would be possible to extend this to use multiple keys so more plugins can use it.  However, you would need to change the pruner to a [front multi key pruner](https://github.com/PopThosePringles/ProBoards-Yootil/blob/version-2/src/pruner.js).

The API is straight forward.

```javascript
let user_id = parseInt(pb.data("user").id, 10);

profile_notifications.api.create(user_id).notification("Hello World!");
```

If you need to know if the notification was successfully saved, then you can use the [promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) that is returned back.

```javascript
let user_id = parseInt(pb.data("user").id, 10);

let p = profile_notifications.api.create(user_id).notification("Hello World!");

p.then(s => console.log(s)).catch(e => console.log(e));
```

The way it works is simple.  We try to push a new item (the notification) to the key.  If there is no space, then the pruner takes over and [shifts](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/shift) items from the front of the key.  When there is space, it will then save the key.  Notifications that get pruned are then removed from [localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) to prevent old ids being kept around.

The reason for localStorage, is because we can't set a key on page load (when the user visits the notifications page), so we store them locally.  Since the notifications are just for the user, then this doesn't matter.

The plugin handles updating the balloon tip that appears in the navigation for "Profile".  It also handles updating the "Notifications" tab count.

On the notifications page a new content div is added above the existing notifications.  We can't join them unfortunately, as the ProBoards notifications are loaded in via AJAX when you load more.

You can change the amount of notifications that show in the `profile_notifications` class.

The building of the notifications list is performed in the `profile_notifications_display` class.  Here is where you would maybe tweak the look and any selectors that are not working due to custom templates.