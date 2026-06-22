import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

/**
 * Fetches rental data from the Google Sheet and returns a map of occupied dates.
 * Falls back to mock data if credentials are not fully set up.
 */
export async function getOccupiedDates() {
  const SPREADSHEET_IDS_STR = process.env.GOOGLE_SHEET_IDS;
  const CLIENT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  // If credentials aren't set, return mock data for UI building
  if (!SPREADSHEET_IDS_STR || !CLIENT_EMAIL || !PRIVATE_KEY) {
    console.log("Using mocked data. Set GOOGLE_SHEET_IDS, GOOGLE_SERVICE_ACCOUNT_EMAIL, and GOOGLE_PRIVATE_KEY in .env.local to connect to real sheet.");
    return getMockData();
  }

  const sheetIds = SPREADSHEET_IDS_STR.split(',').map(id => id.trim());
  const occupiedDatesMap = {};

  const serviceAccountAuth = new JWT({
    email: CLIENT_EMAIL,
    key: PRIVATE_KEY,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  try {
    for (const SPREADSHEET_ID of sheetIds) {
      if (!SPREADSHEET_ID) continue;
      
      const doc = new GoogleSpreadsheet(SPREADSHEET_ID, serviceAccountAuth);
      await doc.loadInfo();
      
      // Assume data is on the first sheet
      const sheet = doc.sheetsByIndex[0];
      const rows = await sheet.getRows();

      rows.forEach(row => {
        const dressId = row['Dress ID'] || row._rawData[9]; // Column J (0-indexed is 9)
        const start = row['Start Date'] || row._rawData[10]; // Column K
        const end = row['End Date'] || row._rawData[11]; // Column L
        const status = row['Confirmation Status'] || row._rawData[12]; // Column M

        // Only process confirmed bookings
        if (status && status.toString().trim() !== '') {
          if (!start || !end) return;

          let currentDate = new Date(start);
          const endDate = new Date(end);

          while (currentDate <= endDate) {
            const offset = currentDate.getTimezoneOffset();
            const mappedDate = new Date(currentDate.getTime() - (offset * 60 * 1000));
            const dateString = mappedDate.toISOString().split('T')[0];
            
            if (!occupiedDatesMap[dateString]) {
              occupiedDatesMap[dateString] = [];
            }
            
            if (!occupiedDatesMap[dateString].includes(dressId)) {
              occupiedDatesMap[dateString].push(dressId);
            }
            
            currentDate.setDate(currentDate.getDate() + 1);
          }
        }
      });
    }

    return occupiedDatesMap;
  } catch (error) {
    console.error("Error fetching Google Sheet data:", error);
    return getMockData(); // fallback
  }
}

function getMockData() {
  const map = {};
  const today = new Date();
  
  // Format helper
  const fmt = (d) => {
      const offset = d.getTimezoneOffset()
      const mappedDate = new Date(d.getTime() - (offset*60*1000))
      return mappedDate.toISOString().split('T')[0]
  };

  // Add some mock dates based on today
  const d1 = new Date(today);
  const d2 = new Date(today);
  d2.setDate(d2.getDate() + 2);
  
  while(d1 <= d2) {
      map[fmt(d1)] = ['Aria-Red-S'];
      d1.setDate(d1.getDate() + 1);
  }

  const d3 = new Date(today);
  d3.setDate(d3.getDate() + 5);
  map[fmt(d3)] = ['Bella-Blue-M', 'Chloe-Black-L'];

  return map;
}
