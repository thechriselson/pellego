/////////////////
// MAPBOX MAPS //
/////////////////

mapboxgl.accessToken = "pk.eyJ1IjoidGhlY2hyaXNlbHNvbiIsImEiOiJjazY2aWMwYW4wNHN3M2xwajVwdXg5bnZwIn0.qN17abkQA21Ry6Bu2PbMBA";
var mapboxMaps = [];

function mapboxMapsAncestor(el, selector) {
	let parent = el.parentNode;
	let counter = 0; let match = false;
	while(!match && counter < 100) {
		if(parent.dataset.mapboxAncestor == selector) {return parent}
		else {parent = parent.parentNode; counter++}
	}
}

function mapboxMapsAddMarker(map, marker) {
	// Create marker
	let el = document.createElement("div");
	el.className = marker.class;
	if(marker.id) {el.id = marker.id}
	// Add to map
	if(marker.popup) {
		new mapboxgl.Marker(el)
			.setLngLat(marker.coordinates)
			.setPopup(marker.popup)
			.addTo(map)
	}
	else {
		new mapboxgl.Marker(el)
			.setLngLat(marker.coordinates)
			.addTo(map)
	}
}

function mapboxMapsFormatOptions(optionsData, extraOptions) {
	var options = {}
	if(extraOptions) {options = extraOptions}
	optionsData.split(",").forEach((option) => {
		let pair = option.split("=");
		if(pair[1] == "true") {pair[1] = true}
		else if(pair[1] == "false") {pair[1] = false}
		else if(pair[1].includes("[") && pair[1].includes("]")) {
			pair[1] = pair[1].replace("[", "").replace("]", "").split("&")
		}
		options[pair[0]] = pair[1]
	});
	return options
}

function mapboxMapsSetup(container) {
	const data = container.dataset;
	// Map
	var mapOptions = mapboxMapsFormatOptions(data.mapboxOptions, {"container": container.id});
	var map = new mapboxgl.Map(mapOptions);
	// Markers
	if(data.mapboxMarkers) {document.querySelectorAll(data.mapboxMarkers).forEach((dataEl) => {
		mData = dataEl.dataset;
		let marker = {
			"class": mData.mapboxClass,
			"coordinates": [mData.mapboxLng, mData.mapboxLat],
			"options": {}
		}
		// Options
		if(mData.mapboxOptions) {marker.options = mapboxMapsFormatOptions(mData.mapboxOptions)}
		// ID
		if(mData.mapboxId) {marker.id = mData.mapboxId}
		// Popup
		if(mData.mapboxPopup) {
			let pOptions = mapboxMapsFormatOptions(mData.mapboxPopup);
			if(mData.mapboxPopupcontent) {
				let pEl = mapboxMapsAncestor(dataEl, mData.mapboxAncestor).querySelector(mData.mapboxPopupcontent);
				marker.popup = new mapboxgl.Popup(pOptions).setDOMContent(pEl)
			}
			else {marker.popup = new mapboxgl.Popup(pOptions)}
		}
		mapboxMapsAddMarker(map, marker)
	})}
}

document.querySelectorAll("[data-mapbox='container']").forEach((container) => {mapboxMapsSetup(container)})
</script>
<script>
var mapboxFilters = [];

function mapboxFilterSetup(cont) {
	let map = {
		"inputs": cont.querySelectorAll("[data-filter='input']"),
		"activeFilters": {}
	}
	if(cont.hasAttribute("data-filter-map")) {
		map["map"] = document.querySelector(cont.getAttribute("data-filter-map"))}
	console.log(map)
}

document.querySelectorAll("[data-filter='container']").forEach(cont => {mapboxFilterSetup(cont)});
