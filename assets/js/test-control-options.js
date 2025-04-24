const sidebar = document.getElementById('controls');
document.getElementById('toggleSidebar').addEventListener('click', function() {
const controlsPanel = document.getElementById('controls');

// Toggle the 'visible' class to show/hide the panel
controlsPanel.classList.toggle('visible');
});

const map = L.map('map').setView([40.5, -100.5], 5);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

const layers = {
    counties: L.layerGroup().addTo(map),
    schools: L.layerGroup(),
    clinics: L.layerGroup(),
    parkruns: L.layerGroup()
};

let data = {
    counties: [],
    schools: [],
    clinics: [],
    parkruns: []
};

async function loadData() {
    const [countiesRes, schoolsRes, clinicsRes, parkrunsRes] = await Promise.all([
    fetch('../data/examples/counties.geojson').then(res => res.json()),
    fetch('../data/examples/schools.geojson').then(res => res.json()),
    fetch('../data/examples/clinics.geojson').then(res => res.json()),
    fetch('../data/parkrun_subset.geojson').then(res => res.json())
    ]);

    data.counties = countiesRes.features;
    data.schools = schoolsRes.features;
    data.clinics = clinicsRes.features;
    data.parkruns = parkrunsRes.features;

    populateDropdown();
    updateMap();
}

function populateDropdown() {
    const regionFilter = document.getElementById('regionFilter');
    const locationIDs = new Set([
    ...data.counties.map(f => f.properties.location_id),
    ...data.schools.map(f => f.properties.location_id),
    ...data.clinics.map(f => f.properties.location_id),
    ...data.parkruns.map(f => f.properties.location_id),
    ]);

    [...locationIDs].sort().forEach(id => {
    const opt = document.createElement('option');
    opt.value = opt.text = id;
    regionFilter.add(opt);
    });

    regionFilter.addEventListener('change', updateMap);
    document.querySelectorAll('.layerCheckbox').forEach(cb => {
        cb.addEventListener('change', updateMap);
      });
      
      document.getElementById('selectAllBtn').addEventListener('click', function () {
        const allCheckboxes = document.querySelectorAll('.layerCheckbox');
        const allChecked = Array.from(allCheckboxes).every(cb => cb.checked);
      
        allCheckboxes.forEach(cb => {
          cb.checked = !allChecked;
          cb.dispatchEvent(new Event('change'));
        });
      
        this.textContent = allChecked ? 'Select All' : 'Deselect All';
      });
}

function updateMap() {
    const selectedRegion = document.getElementById('regionFilter').value;
  
    // Clear and remove all current layers
    Object.values(layers).forEach(layer => {
      layer.clearLayers();
      map.removeLayer(layer);
    });
  
    const showLayer = (type, color, nameField) => {
      const features = selectedRegion
        ? data[type].filter(f => f.properties.location_id === selectedRegion)
        : data[type];
  
      let layer;
      if (type === 'counties') {
        layer = L.geoJSON(features, {
          style: { color: color, weight: 2, fillOpacity: 0.3 },
          onEachFeature: (f, l) => l.bindPopup(f.properties.name)
        });
      } else {
        layer = L.geoJSON(features, {
          pointToLayer: (f, latlng) => L.circleMarker(latlng, {
            radius: 6,
            fillColor: color,
            color: '#fff',
            weight: 1,
            fillOpacity: 0.9
          }),
          onEachFeature: (f, l) => l.bindPopup(f.properties[nameField])
        });
      }
  
      layer.addTo(layers[type]);
      layers[type].addTo(map);
    };
  
    const layerConfigs = {
      counties: { color: 'blue', nameField: 'name' },
      schools: { color: 'orange', nameField: 'school_name' },
      clinics: { color: 'green', nameField: 'clinic_name' },
      parkruns: { color: 'pink', nameField: 'EventLongName' }
    };
  
    document.querySelectorAll('.layerCheckbox:checked').forEach(cb => {
      const type = cb.value;
      const config = layerConfigs[type];
      showLayer(type, config.color, config.nameField);
    });
  }
  


loadData();