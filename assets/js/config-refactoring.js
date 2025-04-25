// config.js (or embed it inside a <script> tag in your Quarto file)
const LAYER_CONFIGS = {
    counties: {
      label: "Counties",
      color: "blue",
      type: "polygon",
      file: "../data/examples/counties.geojson",
      nameField: "name"
    },
    schools: {
      label: "Schools",
      color: "orange",
      type: "point",
      file: "../data/examples/schools.geojson",
      nameField: "school_name"
    },
    clinics: {
      label: "Clinics",
      color: "green",
      type: "point",
      file: "../data/examples/clinics.geojson",
      nameField: "clinic_name"
    },
    parkruns: {
      label: "Park Runs",
      color: "pink",
      type: "point",
      file: "../data/parkrun_subset.geojson",
      nameField: "EventLongName"
    }
  };
  