# Popup manager and controller Vue library
To install in your project
```
npm install @adel-batal/valsdkflskd
```
---
## How to test immediately
1. Clone the repoistory to your machine.
2. In the root directory open a command line window and run `npm install` to install all of the required dependencies.
3. To start testing the library, first run the dev server by running `npm run serve`.
4. For immediate testing, this library currenlty has a json-server fake backend for testing persiting popup data which is saved in `db.json` in the root directory, so running an additional server is required.
5. Open another command line in the root directory and run `npm run fake-backend`.
6. You can add new popups by either manually adding json data in the `db.json` file (may require re-running the backend server), or by using the PopupManager Graphical User Interface.
---

## How to use
The library consists of two components. PopupManager is the admin UI and is used to create,edit and delete popup entries. 
PopupController is the library that runs on the user's end.

### PopupController
To use PopupController on its own you either have to define a custom Popup component with the required interface or add no children and it will use  the default Popup component included in the lib.

#### Custom Popup Usage
```html
<PopupController :popups="popups" ref="controller">
  <template v-slot:default="popupProps">
    <CustomPopup :popup="popupProps.popup"  @close="popupProps.close" />
  </template>
</PopupController>
```

### PopupManager GUI
The available options for a popup configuration object are:
#### Triggers (Popup Editor Component)
- Scroll based
  - Accepts value for:
    - Scroll percentage
    - Frequency in days
- Timer based
  - Accepts value for
    - Specified time period
    - Frequency in days
- Exit-intent based, fires on cursor exiting browser screen
- Touch screen exit-intent based, fires on fast scrolling towards up
- Hover based, triggers on hovering an element
- Click based, triggers on clicking an element

##### PopupManager screenshots
###### Main view
![Alt text](screenshots/popup-manager.png?raw=true "PopupManager")

###### Form views
![Alt text](screenshots/add-popup-1.png?raw=true "Title")

![Alt text](screenshots/add-popup-2.png?raw=true "Title")

![Alt text](screenshots/add-popup-3.png?raw=true "Title")

![Alt text](screenshots//edit-popup.png.png?raw=true "Title")

#### Notes
- There are 7 intreis in the `db.json` file so you can immediately test
- The Vue router library was added to the project for the convenience of the tester and only that

### Build lib
```
npm run build
```

### Lint lib
```
npm run lint
```
### Publish
```
npm run build-lib
npm publish
```