document.addEventListener("DOMContentLoaded", async function () {
    const tableBody = document.getElementById("fishTableBody");
    const regionFilter = document.getElementById("regionFilter");
    const zoneFilter = document.getElementById("zoneFilter");
    const fishFilter = document.getElementById("fishFilter");
    const searchBar = document.getElementById("searchBar");

    let fishZoneData = [];
    let fishValueData = {};

    // Load JSON data
    async function loadJSON(url) {
        const response = await fetch(url);
        return response.json();
    }

    async function fetchData() {
        fishZoneData = await loadJSON("fishzone.json");
        const fishValueArray = await loadJSON("fishvalue.json");

        // Convert fishValueArray to a dictionary for easy lookup
        fishValueArray.forEach(item => {
            fishValueData[item.FISH] = item.VALUE;
        });

        populateFilters();
        updateTable();
    }

    function populateFilters() {
        const regions = new Set();
        const zones = new Set();
        const fishes = new Set();

        fishZoneData.forEach(item => {
            regions.add(item.REGION);
            zones.add(item["ZONE NAME"]);
            fishes.add(item["ITEM NAME"]);
        });

        addOptions(regionFilter, regions);
        addOptions(zoneFilter, zones);
        addOptions(fishFilter, fishes);
    }

    function addOptions(selectElement, items) {
        selectElement.innerHTML = '<option value="">All</option>';
        items.forEach(item => {
            const option = document.createElement("option");
            option.value = item;
            option.textContent = item;
            selectElement.appendChild(option);
        });
    }

    function updateTable() {
        const selectedRegion = regionFilter.value;
        const selectedZone = zoneFilter.value;
        const selectedFish = fishFilter.value.toLowerCase();
        const searchQuery = searchBar.value.toLowerCase();

        tableBody.innerHTML = "";

        fishZoneData.forEach(item => {
            const regionMatch = !selectedRegion || item.REGION === selectedRegion;
            const zoneMatch = !selectedZone || item["ZONE NAME"] === selectedZone;
            const fishMatch = !selectedFish || item["ITEM NAME"].toLowerCase().includes(selectedFish);
            const searchMatch = !searchQuery || item["ITEM NAME"].toLowerCase().includes(searchQuery);

            if (regionMatch && zoneMatch && fishMatch && searchMatch) {
                const row = document.createElement("tr");

                const regionCell = document.createElement("td");
                regionCell.textContent = item.REGION;
                row.appendChild(regionCell);

                const zoneCell = document.createElement("td");
                zoneCell.textContent = item["ZONE NAME"];
                row.appendChild(zoneCell);

                const fishCell = document.createElement("td");
                const fishName = item["ITEM NAME"];
                const fishLink = document.createElement("a");
                fishLink.href = `https://some-fish-image-site.com/${fishName.replace(/ /g, "_")}`;
                fishLink.textContent = fishName;
                fishLink.target = "_blank";
                fishCell.appendChild(fishLink);
                row.appendChild(fishCell);

                const valueCell = document.createElement("td");
                valueCell.textContent = fishValueData[fishName] || "N/A";
                row.appendChild(valueCell);

                tableBody.appendChild(row);
            }
        });
    }

    regionFilter.addEventListener("change", updateTable);
    zoneFilter.addEventListener("change", updateTable);
    fishFilter.addEventListener("change", updateTable);
    searchBar.addEventListener("input", updateTable);

    fetchData();
});
