document.addEventListener("DOMContentLoaded", function () {
    const regionFilter = document.getElementById("regionFilter");
    const zoneFilter = document.getElementById("zoneFilter");
    const fishFilter = document.getElementById("fishFilter");
    const searchBar = document.getElementById("searchBar");
    const fishTableBody = document.getElementById("fishTableBody");
    let fishData = [];

    // Fetch JSON data
    fetch("fish_data.json")
        .then(response => response.json())
        .then(data => {
            fishData = data;
            populateFilters();
            displayData(fishData);
        })
        .catch(error => console.error("Error loading data:", error));

    function populateFilters() {
        const regions = new Set();
        const zones = new Set();
        const fishes = new Set();

        fishData.forEach(fish => {
            regions.add(fish.Region);
            zones.add(fish.Zone);
            fishes.add(fish.Fish);
        });

        addOptions(regionFilter, regions);
        addOptions(zoneFilter, zones);
        addOptions(fishFilter, fishes);
    }

    function addOptions(selectElement, items) {
        items.forEach(item => {
            const option = document.createElement("option");
            option.value = item;
            option.textContent = item;
            selectElement.appendChild(option);
        });
    }

    function displayData(filteredData) {
        fishTableBody.innerHTML = "";
        filteredData.forEach(fish => {
            const row = `<tr>
                <td>${fish.Region}</td>
                <td>${fish.Zone}</td>
                <td>${fish.Fish}</td>
                <td>${fish.Value}</td>
            </tr>`;
            fishTableBody.innerHTML += row;
        });
    }

    function filterData() {
        const selectedRegion = regionFilter.value;
        const selectedZone = zoneFilter.value;
        const selectedFish = fishFilter.value;
        const searchText = searchBar.value.toLowerCase();

        const filteredData = fishData.filter(fish => {
            return (
                (selectedRegion === "" || fish.Region === selectedRegion) &&
                (selectedZone === "" || fish.Zone === selectedZone) &&
                (selectedFish === "" || fish.Fish === selectedFish) &&
                (searchText === "" || fish.Fish.toLowerCase().includes(searchText))
            );
        });
        displayData(filteredData);
    }

    regionFilter.addEventListener("change", filterData);
    zoneFilter.addEventListener("change", filterData);
    fishFilter.addEventListener("change", filterData);
    searchBar.addEventListener("input", filterData);
});
