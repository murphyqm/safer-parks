const sidebar = document.getElementById('controls');
document.getElementById('toggleSidebar').addEventListener('click', function() {
  sidebar.classList.toggle('visible');
});

const map = L.map('map').setView([53.8, -1.5], 5);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

const baseMaps = {
  "Light (CartoDB Positron)": L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', { attribution:
    '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>',
  subdomains: 'abcd',
  maxZoom: 19}),
  "Dark (CartoDB Dark Matter)": L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', { attribution:
    '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>',
  subdomains: 'abcd',
  maxZoom: 19 }),
  "OpenStreetMap": L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  })
};

L.control.layers(baseMaps, null, { position: 'bottomright' }).addTo(map);

const layers = {};
const data = {};

async function loadData() {
  generateCheckboxes();

  const entries = Object.entries(LAYER_CONFIGS);

  await Promise.all(entries.map(async ([key, cfg]) => {
    const res = await fetch(cfg.file);
    const geojson = await res.json();
    data[key] = geojson.features;
    layers[key] = L.layerGroup();
  }));

  populateDropdown();
  updateMap();
}

function generateCheckboxes() {
  const fieldset = document.querySelector('fieldset');
  fieldset.innerHTML = '<legend><strong>Layer Type</strong></legend>';

  Object.entries(LAYER_CONFIGS).forEach(([key, cfg]) => {
    const label = document.createElement("label");
    label.innerHTML = `<input type="checkbox" class="layerCheckbox" value="${key}" checked> ${cfg.label}`;
    fieldset.appendChild(label);
  });

  const toggleBtn = document.createElement('button');
  toggleBtn.type = 'button';
  toggleBtn.id = 'selectAllBtn';
  toggleBtn.textContent = 'Deselect All';
  fieldset.appendChild(document.createElement('br'));
  fieldset.appendChild(toggleBtn);
}

function populateDropdown() {
  const regionFilter = document.getElementById('regionFilter');

  const locationIDs = new Set();
  Object.values(data).forEach(features => {
    features.forEach(f => locationIDs.add(f.properties.location_id));
  });

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

  Object.values(layers).forEach(layer => {
    layer.clearLayers();
    map.removeLayer(layer);
  });

  document.querySelectorAll('.layerCheckbox:checked').forEach(cb => {
    const type = cb.value;
    const cfg = LAYER_CONFIGS[type];
    const features = selectedRegion
      ? data[type].filter(f => f.properties.location_id === selectedRegion)
      : data[type];

    const geojsonLayer = (cfg.type === "polygon")
      ? L.geoJSON(features, {
          style: { color: cfg.color, weight: 2, fillOpacity: 0.3 },
          onEachFeature: (f, l) => l.bindPopup(f.properties[cfg.nameField])
        })
      : L.geoJSON(features, {
          pointToLayer: (f, latlng) => L.circleMarker(latlng, {
            radius: 15,
            fillColor: cfg.color,
            color: '#fff',
            weight: 1,
            fillOpacity: 0.9
          }),
          onEachFeature: (f, l) => l.bindPopup(f.properties[cfg.nameField])
        });

    geojsonLayer.addTo(layers[type]);
    layers[type].addTo(map);
  });
}

loadData();
