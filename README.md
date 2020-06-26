# COViz
The Covid-19 Open Visualization (COViz) Toolkit is a modular open-source web toolkit for hybrid map/graph visualization of COVID-19 risk burden, resource and testing sufficiency and trajectories over time. In contrast to many dashboards that are data-driven and/or built on proprietary software, COViz is an efficient, lightweight open platform that focuses on use of sound cartographic principles to construct targeted visualizations that intuitively communicate information relevant to specific epidemiological questions.

# Modular Structure
COViz is modular, enabling anybody with a bit of JavaScript experience to add new data sources and/or map themes.

# Data Sources
To add a data source:
1. Make a copy of the "states_covidtracking_TEMPLATE" subfolder in the data folder.
2. Rename the new folder copy and internal files as appropriate.
3. Open the javascript file contained inside the new folder copy and follow the instructions in the comments at the top of the file.

# Map Themes
To add a new map theme:
1. Make a copy of "themes/theme_increase_week_over_week_TEMPLATE.js" and rename as appropriate.
2. Open the file and follow the instructions.
