document.addEventListener("DOMContentLoaded", function () {
    Promise.all([
        fetch('fishzone.json').then(response => response.json()),
        fetch('fishvalue.json').then(response => response.json())
    ]).then(([fishZoneData, fishValueData]) => {
        const regionFilter = document.getElementById("regionFilter");
        const zoneFilter = document.getElementById("zoneFilter");
        const fishFilter = document.getElementById("fishFilter");
        const searchBar = document.getElementById("searchBar");
        const clearFilterBtn = document.getElementById("clearFilter");
        const tableBody = document.getElementById("fishTableBody");
        const tableHeaders = document.querySelectorAll("th.sortable");
        
        let currentSortColumn = null;
        let currentSortDirection = "asc";

        function updateZoneFilter() {
            const selectedRegion = regionFilter.value;
            zoneFilter.innerHTML = '<option value="">All Zones</option>';
            
            const filteredZones = [...new Set(fishZoneData
                .filter(item => selectedRegion === "" || item.REGION === selectedRegion)
                .map(item => item["ZONE NAME"]))];
            
            filteredZones.forEach(zone => {
                const option = document.createElement("option");
                option.value = zone;
                option.textContent = zone;
                zoneFilter.appendChild(option);
            });

            updateFishFilter();
        }

        function updateFishFilter() {
            const selectedRegion = regionFilter.value;
            const selectedZone = zoneFilter.value;
            fishFilter.innerHTML = '<option value="">All Fish</option>';
            
            const filteredFish = [...new Set(fishZoneData
                .filter(item => (selectedRegion === "" || item.REGION === selectedRegion) &&
                                (selectedZone === "" || item["ZONE NAME"] === selectedZone))
                .map(item => item["ITEM NAME"]))];
            
            filteredFish.forEach(fish => {
                const option = document.createElement("option");
                option.value = fish;
                option.textContent = fish;
                fishFilter.appendChild(option);
            });
        }

        function updateTable() {
            const selectedRegion = regionFilter.value.toLowerCase();
            const selectedZone = zoneFilter.value.toLowerCase();
            const selectedFish = fishFilter.value.toLowerCase();
            const searchText = searchBar.value.toLowerCase();
            
            tableBody.innerHTML = "";

            let filteredData = fishZoneData.filter(item =>
                (selectedRegion === "" || item.REGION.toLowerCase().includes(selectedRegion)) &&
                (selectedZone === "" || item["ZONE NAME"].toLowerCase().includes(selectedZone)) &&
                (selectedFish === "" || item["ITEM NAME"].toLowerCase().includes(selectedFish)) &&
                (searchText === "" || Object.values(item).some(value =>
                    value.toString().toLowerCase().includes(searchText)))
            );

            if (currentSortColumn) {
                filteredData.sort((a, b) => {
                    let valueA = a[currentSortColumn] || "";
                    let valueB = b[currentSortColumn] || "";

                    if (typeof valueA === "string") valueA = valueA.toLowerCase();
                    if (typeof valueB === "string") valueB = valueB.toLowerCase();

                    if (currentSortDirection === "asc") {
                        return valueA > valueB ? 1 : -1;
                    } else {
                        return valueA < valueB ? 1 : -1;
                    }
                });
            }

            filteredData.forEach(item => {
                const fishValue = fishValueData.find(fv => fv.FISH === item["ITEM NAME"]);
                const value = fishValue ? fishValue.VALUE : "N/A";
                
                const row = `<tr>
                    <td>${item.REGION}</td>
                    <td>${item["ZONE NAME"]}</td>
                    <td>${item["ITEM NAME"]}</td>
                    <td>${value}</td>
                </tr>`;
                tableBody.innerHTML += row;
            });
        }

        function clearFilters() {
            regionFilter.value = "";
            zoneFilter.innerHTML = '<option value="">All Zones</option>';
            fishFilter.innerHTML = '<option value="">All Fish</option>';
            searchBar.value = "";
            updateTable();
        }

        function setupSorting() {
            tableHeaders.forEach(header => {
                header.addEventListener("click", function () {
                    const column = header.dataset.column;
                    if (currentSortColumn === column) {
                        currentSortDirection = currentSortDirection === "asc" ? "desc" : "asc";
                    } else {
                        currentSortColumn = column;
                        currentSortDirection = "asc";
                    }
                    updateTable();
                });
            });
        }

        const regions = [...new Set(fishZoneData.map(item => item.REGION))];
        regions.forEach(region => {
            const option = document.createElement("option");
            option.value = region;
            option.textContent = region;
            regionFilter.appendChild(option);
        });

        regionFilter.addEventListener("change", () => {
            updateZoneFilter();
            updateFishFilter();
            updateTable();
        });
        zoneFilter.addEventListener("change", () => {
            updateFishFilter();
            updateTable();
        });
        fishFilter.addEventListener("change", updateTable);
        searchBar.addEventListener("input", updateTable);
        clearFilterBtn.addEventListener("click", clearFilters);

        setupSorting();
        updateZoneFilter();
        updateFishFilter();
        updateTable();
    }).catch(error => console.error("Error loading data:", error));
});
