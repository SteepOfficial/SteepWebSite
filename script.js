var gk_isXlsx = false;
var gk_xlsxFileLookup = {};
var gk_fileData = {};

function filledCell(cell) {
  return cell !== '' && cell != null;
}

function loadFileData(filename) {
  if (gk_isXlsx && gk_xlsxFileLookup[filename]) {
    try {
      var workbook = XLSX.read(gk_fileData[filename], { type: 'base64' });
      var firstSheetName = workbook.SheetNames[0];
      var worksheet = workbook.Sheets[firstSheetName];

      // Convert sheet to JSON to filter blank rows
      var jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, blankrows: false, defval: '' });
      var filteredData = jsonData.filter(row => row.some(filledCell));

      // Heuristic to find the header row
      var headerRowIndex = filteredData.findIndex((row, index) =>
        row.filter(filledCell).length >= filteredData[index + 1]?.filter(filledCell).length
      );
      if (headerRowIndex === -1 || headerRowIndex > 25) {
        headerRowIndex = 0;
      }

      // Convert filtered data to HTML game cards
      var gameGrid = document.getElementById('game-grid');
      gameGrid.innerHTML = '';
      filteredData.slice(headerRowIndex + 1).forEach(row => {
        if (row.length >= 3) { // Assuming columns: Title, Description, Link
          gameGrid.innerHTML += `
            <div class="bg-white p-6 rounded-lg shadow-lg">
              <h3 class="text-2xl font-semibold mb-2">${row[0]}</h3>
              <p>${row[1]}</p>
              <a href="${row[2]}" target="_blank" class="bg-blue-600 text-white px-4 py-2 rounded-full mt-4 inline-block hover:bg-blue-700">Oyna</a>
            </div>
          `;
        }
      });
      return;
    } catch (e) {
      console.error(e);
    }
  }
  return gk_fileData[filename] || "";
}

// Smooth Scroll for Navigation
document.addEventListener('DOMContentLoaded', () => {
  // Smooth scroll için navigasyon linklerine tıklama eventi
  document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);
      targetElement.scrollIntoView({ behavior: 'smooth' });
    });
  });

  // Aynı eventi hero section’daki "Oyunları Keşfet" butonuna da ekleyelim
  document.querySelector('.hero-button').addEventListener('click', function(e) {
    e.preventDefault();
    const targetId = this.getAttribute('href').substring(1);
    const targetElement = document.getElementById(targetId);
    targetElement.scrollIntoView({ behavior: 'smooth' });
  });

  // Örnek veri (gerçek bir XLSX/CSV yerine test için)
  var sampleData = "data:application/octet-stream;base64,SGVsbG8sV29ybGQ="; // Base64 encoded sample
  gk_fileData['games.xlsx'] = sampleData;
  gk_isXlsx = true;
  gk_xlsxFileLookup['games.xlsx'] = true;
  loadFileData('games.xlsx');
});
