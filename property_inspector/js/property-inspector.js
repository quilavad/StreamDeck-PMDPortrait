// global websocket, used to communicate from/to Stream Deck software
// as well as some info about our plugin, as sent by Stream Deck software 
var websocket = null,
  uuid = null,
  inInfo = null,
  actionInfo = {},
	settingsModel = {
		DexNo: 156,
		Form: 0,
		Shiny: false,
		Duration: 3000
  };

function connectElgatoStreamDeckSocket(inPort, inUUID, inRegisterEvent, inInfo, inActionInfo) {
  uuid = inUUID;
  actionInfo = JSON.parse(inActionInfo);
  inInfo = JSON.parse(inInfo);
  websocket = new WebSocket('ws://localhost:' + inPort);

  //initialize values
	if (actionInfo.payload.settings.settingsModel) {
		settingsModel.DexNo = actionInfo.payload.settings.settingsModel.DexNo;
		settingsModel.Form = actionInfo.payload.settings.settingsModel.Form;
		settingsModel.Shiny = actionInfo.payload.settings.settingsModel.Shiny;
		settingsModel.Duration = actionInfo.payload.settings.settingsModel.Duration;
  }

	document.getElementById('txtDexNoValue').value = settingsModel.DexNo;
	document.getElementById('txtFormValue').value = settingsModel.Form;
	document.getElementById('txtShinyValue').checked = settingsModel.Shiny;
	document.getElementById('txtDurationValue').value = settingsModel.Duration;

  websocket.onopen = function () {
	var json = { event: inRegisterEvent, uuid: inUUID };
	// register property inspector to Stream Deck
	websocket.send(JSON.stringify(json));

  };

  websocket.onmessage = function (evt) {
	// Received message from Stream Deck
	var jsonObj = JSON.parse(evt.data);
	var sdEvent = jsonObj['event'];
	switch (sdEvent) {
		case "didReceiveSettings":
			if (jsonObj.payload.settings.settingsModel.DexNo) {
				settingsModel.DexNo = jsonObj.payload.settings.settingsModel.DexNo;
				document.getElementById('txtDexNoValue').value = settingsModel.DexNo;
			}
			if (jsonObj.payload.settings.settingsModel.Form) {
				settingsModel.Form = jsonObj.payload.settings.settingsModel.Form;
				document.getElementById('txtFormValue').value = settingsModel.Form;
			}
			if (jsonObj.payload.settings.settingsModel.Shiny) {
				settingsModel.Shiny = jsonObj.payload.settings.settingsModel.Shiny;
				document.getElementById('txtShinyValue').checked = settingsModel.Shiny;
			}
			if (jsonObj.payload.settings.settingsModel.DexNo) {
				settingsModel.DexNo = jsonObj.payload.settings.settingsModel.DexNo;
				document.getElementById('txtDurationValue').value = settingsModel.Duration;
			}
		break;
	  default:
		break;
	}
  };
}

const setSettings = (value, param) => {
  if (websocket) {
	settingsModel[param] = value;
	var json = {
	  "event": "setSettings",
	  "context": uuid,
	  "payload": {
		"settingsModel": settingsModel
	  }
	};
	websocket.send(JSON.stringify(json));
  }
};

