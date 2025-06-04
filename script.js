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

      var jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, blankrows: false, defval: '' });
      var filteredData = jsonData.filter(row => row.some(filledCell));

      var headerRowIndex = filteredData.findIndex((row, index) =>
        row.filter(filledCell).length >= filteredData[index + 1]?.filter(filledCell).length
      );
      if (headerRowIndex === -1 || headerRowIndex > 25) {
        headerRowIndex = 0;
      }

      var gameGrid = document.getElementById('game-grid');
      gameGrid.innerHTML = '';
      filteredData.slice(headerRowIndex + 1).forEach(row => {
        if (row.length >= 3) {
          gameGrid.innerHTML += `
            <div class="bg-dark p-6 rounded-lg shadow-lg">
              <h3 class="text-2xl font-semibold mb-2 text-accent">${row[0]}</h3>
              <p class="text-gray-300">${row[1]}</p>
              <a href="${row[2]}" target="_blank" class="bg-accent text-dark px-4 py-2 rounded-full mt-4 inline-block hover:bg-accent-hover">Play Now</a>
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

// Smooth Scroll and Initial Load
document.addEventListener('DOMContentLoaded', () => {
  // Smooth scroll for navigation
  document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);
      targetElement.scrollIntoView({ behavior: 'smooth' });
    });
  });

  // Smooth scroll for hero button
  document.querySelector('.hero-button').addEventListener('click', function(e) {
    e.preventDefault();
    const targetId = this.getAttribute('href').substring(1);
    const targetElement = document.getElementById(targetId);
    targetElement.scrollIntoView({ behavior: 'smooth' });
  });

  // Sample data for testing
  var sampleData = "data:application/octet-stream;base64,SGVsbG8sV29ybGQ=";
  gk_fileData['games.xlsx'] = sampleData;
  gk_isXlsx = true;
  gk_xlsxFileLookup['games.xlsx'] = true;
  loadFileData('games.xlsx');
});
