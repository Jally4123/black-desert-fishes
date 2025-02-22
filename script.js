document.addEventListener("DOMContentLoaded", function () {
    Promise.all([
        fetch('fishzone.json').then(response => response.json()),
        fetch('fishvalue.json').then(response => response.json())
    ]).then(([fishZoneData, fishValueData]) => {
        const regionFilter = document.getElementById("regionFilter");
        const zoneFilter = document.getElementById("zoneFilter");
        const fishFilter = document.getElementById("fishFilter");
        const searchBar = document.getElementById("searchBar");
        const tableBody = document.getElementById("fishTableBody");

        function updateZoneFilter() {
            const selectedRegion = regionFilter.value;
            zoneFilter.innerHTML = '<option value="">All Zones</option>';
            
            const filteredZones = fishZoneData
                .filter(item => selectedRegion === "" || item.REGION === selectedRegion)
                .map(item => item["ZONE NAME"]);
            
            [...new Set(filteredZones)].forEach(zone => {
                const option = document.createElement("option");
                option.value = zone;
                option.textContent = zone;
                zoneFilter.appendChild(option);
            });
        }

        function updateTable() {
            const region = regionFilter.value;
            const zone = zoneFilter.value;
            const fish = fishFilter.value.toLowerCase();
            const searchText = searchBar.value.toLowerCase();
            
            tableBody.innerHTML = "";

            fishZoneData.forEach(item => {
                if ((region === "" || item.REGION === region) &&
                    (zone === "" || item["ZONE NAME"] === zone) &&
                    (fish === "" || item["ITEM NAME"].toLowerCase().includes(fish)) &&
                    (searchText === "" || item["ITEM NAME"].toLowerCase().includes(searchText))) {
                    
                    const fishValue = fishValueData.find(fv => fv.FISH === item["ITEM NAME"]);
                    const value = fishValue ? fishValue.VALUE : "N/A";
                    
                    const row = `<tr>
                        <td>${item.REGION}</td>
                        <td>${item["ZONE NAME"]}</td>
                        <td>${item["ITEM NAME"]}</td>
                        <td>${value}</td>
                    </tr>`;
                    tableBody.innerHTML += row;
                }
            });
        }

        const regions = [...new Set(fishZoneData.map(item => item.REGION))];
        regions.forEach(region => {
            const option = document.createElement("option");
            option.value = region;
            option.textContent = region;
            regionFilter.appendChild(option);
        });

        const fishNames = [...new Set(fishZoneData.map(item => item["ITEM NAME"]))];
        fishNames.forEach(fish => {
            const option = document.createElement("option");
            option.value = fish;
            option.textContent = fish;
            fishFilter.appendChild(option);
        });

        regionFilter.addEventListener("change", () => {
            updateZoneFilter();
            updateTable();
        });
        zoneFilter.addEventListener("change", updateTable);
        fishFilter.addEventListener("change", updateTable);
        searchBar.addEventListener("input", updateTable);

        updateZoneFilter();
        updateTable();
    }).catch(error => console.error("Error loading data:", error));
});
